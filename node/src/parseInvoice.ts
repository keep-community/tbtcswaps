import {parsePaymentRequest} from 'ln-service';

export default function parseInvoice(rawInvoice:string){
    const invoice = parsePaymentRequest({request:rawInvoice})
    if(invoice.network !== 'bitcoin'){
        throw new Error("This service is only available for Mainnet")
    }
    return invoice
}
