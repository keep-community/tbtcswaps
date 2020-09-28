import React from "react";
import Web3 from "web3";
import { Ln2tbtcContract, ERC20Contract } from "../../ethereum";
import TextField from "@material-ui/core/TextField";
import { decode } from "@node-lightning/invoice";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ln2tbtcABI from "../../contracts/LN2tBTC.json";
import tbtcABI from "../../contracts/IERC20.json";
import type { AbiItem } from "web3-utils";
import { tbtcAddress, ln2tbtcAddress } from "../../contracts/deployedAddresses";
import "./Invoice.css";

async function createSwap(
  web3: Web3,
  invoice: string,
  paymentHash: string,
  tBTCAmount: string,
  operatorAddress: string
) {
  const ln2tbtcContract: Ln2tbtcContract = new web3.eth.Contract(
    ln2tbtcABI.abi as AbiItem[],
    ln2tbtcAddress
  );
  const tbtcContract: ERC20Contract = new web3.eth.Contract(
    tbtcABI.abi as AbiItem[],
    tbtcAddress
  );
  const userAddress = (web3.currentProvider as any).selectedAddress;
  await tbtcContract.methods.approve(ln2tbtcAddress, tBTCAmount).send({
    from: userAddress,
  });
  await ln2tbtcContract.methods
    .createTBTC2LNSwap(paymentHash, tBTCAmount, operatorAddress, invoice)
    .send({
      from: userAddress,
    });
}

export default function Invoice(props: {
  web3: Web3;
  tBTCAmount: string;
  operatorAddress: string;
}) {
  const [invoice, setInvoice] = React.useState<string>("");
  let error = false;
  let result: ReturnType<typeof decode>;
  if (invoice !== "") {
    try {
      result = decode(invoice);
    } catch (e) {
      error = true;
    }
  }
  return (
    <>
      <TextField
        id="filled-multiline-flexible"
        label="Lightning Invoice"
        error={error}
        helperText={error ? "Invoice is incorrect" : undefined}
        multiline
        rowsMax={8}
        variant="filled"
        onChange={(event) => setInvoice(event.target.value)}
        className="wideTextField"
      />
      {invoice !== "" && error === false ? (
        <>
          <Divider />
          Value: {result!.valueSat}
          <br />
          Payment Hash: {result!.paymentHash}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() =>
              createSwap(
                props.web3,
                invoice,
                result!.paymentHash.toString(),
                props.tBTCAmount,
                props.operatorAddress
              )
            }
          >
            Swap
          </Button>
        </>
      ) : undefined}
    </>
  );
}
