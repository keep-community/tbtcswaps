import express from "express";
import cors from 'cors';
import { authenticatedLndGrpc, createHodlInvoice, settleHodlInvoice } from 'ln-service'
import parseInvoice from './parseInvoice'
import { contract, address } from './contract'
import { ignoreUnrelatedEvents } from './utils'
import getRoute, {calculateDelay} from './getRoute'

const { lnd } = authenticatedLndGrpc({
  cert: 'base64 encoded tls.cert',
  macaroon: 'base64 encoded admin.macaroon',
  socket: '127.0.0.1:10009',
});

const app = express();
app.use(cors());
app.listen(8080);

// tBTC -> LN
app.get('/ln2tbtc/lockTime/:invoice', async (req, res) => {
  const invoice = parseInvoice(req.params.invoice);
  const {timeoutDelta, fee} = await getRoute(lnd, invoice);
  const delay = calculateDelay(timeoutDelta)
  res.send({
    fee,
    delay
  })
})

contract.events.TBTC2LNSwapCreated({}, ignoreUnrelatedEvents(event => {
  const invoice = parseInvoice(event.returnValues.invoice);
  const {paymentHash, amount} = event.returnValues;
  // Check matching hash
  if(invoice.id !== paymentHash){
    return;
  }
  // Check amount
  if(amount)
  // Check that lockup time is corect
  // Pay invoice
  invoice.safe_tokens = undefined;
  invoice.mtokens = undefined;
  payViaRoutes
  // Subscribe to invoice - once paid send an eth tx revealing pre-image
}))

// LN -> tBTC
contract.events.LN2TBTCSwapCreated({}, ignoreUnrelatedEvents(async event => {
  // Create new hold invoice with specified paymentHash
  const { request } = await createHodlInvoice({ id, lnd });
  // When HTLCs are locked (payment sent) - lock tbtc
}))

app.get('/tbtc2ln/invoice/:paymentHash', (req, res) => {
  const paymentHash = parseInvoice(req.params.paymentHash)
  // Check a contract call has been made with paymentHash
  // Send previously created invoice
})

contract.events.LN2TBTCPreimageRevealed({}, ignoreUnrelatedEvents(event => {
  const preimage = event.returnValues.preimage;
  // Settle invoice
  settleHodlInvoice({
    lnd,
    secret: preimage
  })
}))