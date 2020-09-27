import express from "express";
import cors from 'cors';
import {authenticatedLndGrpc} from 'ln-service'
import parseInvoice from './parseInvoice'
 
const {lnd} = authenticatedLndGrpc({
  cert: 'base64 encoded tls.cert',
  macaroon: 'base64 encoded admin.macaroon',
  socket: '127.0.0.1:10009',
});

const app = express();
app.use(cors());
app.listen(8080);

app.get('/ln2tbtc/lockup/:invoice', (req, res)=>{
    const invoice = parseInvoice(req.params.invoice)
})