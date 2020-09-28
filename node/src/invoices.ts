const {createHash, randomBytes} = require('crypto');
const {createHodlInvoice, settleHodlInvoice} = require('ln-service');
const {subscribeToInvoice} = require('ln-service');
 
const randomSecret = () => randomBytes(32);
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
 
// Choose an r_hash for this invoice, a single sha256, on say randomBytes(32)
const secret = randomSecret();
 
const id = sha256(secret);
 
// Supply an authenticatedLndGrpc object for an lnd built with invoicesrpc tag
const {request} = await createHodlInvoice({id, lnd});
 
// Share the request with the payer and wait for a payment
const sub = subscribeToInvoice({id, lnd});
 
sub.on('invoice_updated', async invoice => {
  // Only actively held invoices can be settled
  if (!invoice.is_held) {
    return;
  }
 
  // Use the secret to claim the funds
  await settleHodlInvoice(({lnd, secret: secret.toString('hex')}));
});