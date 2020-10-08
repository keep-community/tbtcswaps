/* global BigInt */
import express from "express";
import cors from "cors";
import redis from "redis";
import {
  authenticatedLndGrpc,
  createHodlInvoice,
  settleHodlInvoice,
  subscribeToPayViaRoutes,
  subscribeToInvoice,
} from "ln-service";
import parseInvoice from "./parseInvoice";
import { contract, ethAddress, web3 } from "./contract";
import { ignoreUnrelatedEvents } from "./utils";
import getRoute, { calculateDelay } from "./getRoute";
import { addFees } from "./fees";

const { LND_CERT, LND_MACAROON, LND_URL, REDIS_URL, PORT } = process.env;
if (
  LND_CERT === undefined ||
  LND_MACAROON === undefined ||
  LND_URL === undefined ||
  REDIS_URL === undefined ||
  PORT === undefined
) {
  throw new Error(
    "Environment variables PORT, REDIS_URL, LND_CERT, LND_MACAROON and LND_URL must be defined but some of them were not"
  );
}
const { lnd } = authenticatedLndGrpc({
  cert: LND_CERT,
  macaroon: LND_MACAROON,
  socket: LND_URL,
});
const operatorFees = contract.methods
  .operators(ethAddress)
  .call()
  .then((op) => {
    const linearFee = BigInt(op.linearFee);
    const constantFee = BigInt(op.constantFee);
    return {
      linearFee,
      constantFee,
    };
  });

const app = express();
app.use(cors());
app.listen(Number(PORT));

let redisClient: redis.RedisClient;
if (REDIS_URL === "local") {
  console.log(
    "Using a local version of redis. This is meant for development, do not use in production"
  );
  redisClient = redis.createClient();
} else {
  redisClient = redis.createClient(REDIS_URL);
}

// tBTC -> LN
app.get("/ln2tbtc/lockTime/:invoice", async (req, res) => {
  try {
    const invoice = parseInvoice(req.params.invoice);
    const { timeoutDelta, fee } = await getRoute(lnd, invoice);
    const delay = calculateDelay(timeoutDelta);
    res.send({
      fee,
      delay,
    });
  } catch (e) {
    res.status(400).send({
      error: "Could not process invoice",
    });
  }
});

contract.events.TBTC2LNSwapCreated(
  {},
  ignoreUnrelatedEvents(async (event) => {
    console.log("tBTC -> LN Swap created. Received event:", event);
    try {
      const invoice = parseInvoice(event.returnValues.invoice);
      const { amount, lockTime, userAddress } = event.returnValues;
      const paymentHash = event.returnValues.paymentHash.substr(2);
      console.log(invoice.id);
      // Check matching hash
      if (invoice.id !== paymentHash) {
        throw new Error(
          "paymentHash doesn't match the one provided in invoice"
        );
      }
      // Check that lockup time is corect
      const { timeoutDelta, route } = await getRoute(lnd, invoice);
      const paymentDelay = BigInt(calculateDelay(timeoutDelta));

      if (BigInt(lockTime) < paymentDelay) {
        throw new Error("lockTime is too low");
      }
      // Check amount
      const { linearFee, constantFee } = await operatorFees;
      const amountLockedInSats = BigInt(amount) / BigInt(10) ** BigInt(10);
      const amountToPay = addFees(amountLockedInSats, constantFee, linearFee); // TODO: Add LN & ethereum fees
      const { mtokens, tokens, safe_tokens } = invoice;
      if (
        mtokens === undefined &&
        tokens === undefined &&
        safe_tokens === undefined
      ) {
        throw new Error("No amount provided in invoice, user could lose money");
      }
      if (tokens !== undefined) {
        if (BigInt(tokens) > amountToPay) {
          throw new Error("Amount to pay is too large");
        }
      }
      if (mtokens !== undefined) {
        if (BigInt(tokens) > amountToPay * BigInt(1000)) {
          throw new Error("Amount to pay is too large");
        }
      }
      if (safe_tokens !== undefined) {
        if (BigInt(safe_tokens) > amountToPay) {
          throw new Error("Amount to pay is too large");
        }
      }
      // Pay invoice
      const sub = subscribeToPayViaRoutes({
        lnd,
        id: invoice.id,
        routes: [route],
      });
      // Once paid send an eth tx revealing pre-image
      sub.on("success", async ({ secret }) => {
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .operatorClaimPayment(userAddress, `0x${paymentHash}`, `0x${secret}`)
          .estimateGas({ from: ethAddress });
        await contract.methods
          .operatorClaimPayment(userAddress, `0x${paymentHash}`, `0x${secret}`)
          .send({
            from: ethAddress,
            gasPrice,
            gas: gasEstimate,
          });
      });
    } catch (e) {
      console.log(e);
    }
  })
);

// LN -> tBTC
function invoiceKey(userAddress: string, paymentHash: string) {
  return `${userAddress}#${paymentHash}`;
}
function storeInvoice(
  userAddress: string,
  paymentHash: string,
  invoice: string
) {
  return new Promise((resolve, reject) => {
    redisClient.set(
      invoiceKey(userAddress, paymentHash),
      invoice,
      "NX",
      (err) => {
        if (err !== null) {
          reject(
            new Error(
              "An invoice with the same paymentHash has already been created before by the same user"
            )
          );
        } else {
          resolve();
        }
      }
    );
  });
}
function getInvoice(userAddress: string, paymentHash: string) {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(invoiceKey(userAddress, paymentHash), (err, reply) => {
      if (err === null && reply !== null) {
        resolve(reply);
      } else {
        reject(new Error("Invoice for this payment has not been generated"));
      }
    });
  });
}

contract.events.LN2TBTCSwapCreated(
  {},
  ignoreUnrelatedEvents(async (event) => {
    console.log("LN -> tBTC Swap created. Received event:", event);
    const { tBTCAmount } = event.returnValues;
    let { paymentHash, userAddress } = event.returnValues;
    userAddress = userAddress.toLowerCase();
    paymentHash = paymentHash.substr(2);
    const { linearFee, constantFee } = await operatorFees;
    const satsToReceive =
      addFees(BigInt(tBTCAmount), constantFee, linearFee) /
      BigInt(10) ** BigInt(10);
    // Create new hold invoice with specified paymentHash
    const { request } = await createHodlInvoice({
      lnd,
      id: paymentHash,
      tokens: Number(satsToReceive),
    });
    await storeInvoice(userAddress, paymentHash, request);
    // When HTLCs are locked (payment sent) - lock tbtc
    const sub = subscribeToInvoice({
      lnd,
      id: paymentHash,
    });
    let contractCallSubmitted = false;
    sub.on("invoice_updated", async (invoice) => {
      // Only actively held invoices can be settled
      if (invoice.is_held && !contractCallSubmitted) {
        contractCallSubmitted = true;
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .operatorLockTBTCForLN2TBTCSwap(userAddress, `0x${paymentHash}`)
          .estimateGas({ from: ethAddress });
        console.log(gasEstimate, gasPrice);
        await contract.methods
          .operatorLockTBTCForLN2TBTCSwap(userAddress, `0x${paymentHash}`)
          .send({
            from: ethAddress,
            gasPrice,
            gas: gasEstimate,
          });
      }
    });
  })
);

app.get("/tbtc2ln/invoice/:userAddress/:paymentHash", async (req, res) => {
  const { userAddress, paymentHash } = req.params;
  const invoice = await getInvoice(userAddress, paymentHash);
  res.send({
    invoice,
  });
});

contract.events.LN2TBTCPreimageRevealed(
  {},
  ignoreUnrelatedEvents((event) => {
    const { preimage } = event.returnValues;
    // Settle invoice
    settleHodlInvoice({
      lnd,
      secret: preimage.substr(2),
    });
  })
);

console.log(
  `Started up node with ETH address ${ethAddress} and connected to lnd node at ${LND_URL}`
);
