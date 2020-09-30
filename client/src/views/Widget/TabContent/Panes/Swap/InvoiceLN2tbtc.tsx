import React, { useState, useEffect, useContext } from "react";
import ActionButton from "../../../common/ActionButton";
import ContentBlock, { TextQR } from "../../../common/ContentBlock";
import { decode } from "@node-lightning/invoice";
import {ExtendedOperator } from "../../../../../ethereum";
import Web3Context from "../../../../../Web3Context";
import {sha256} from '../../../utils'

interface APIResponse {
  invoice:string
}

const InvoicePane: React.FC<{
  operator:ExtendedOperator,
  secret:Buffer,
  lnAmount: string
}> = ({operator, secret, lnAmount}) => {
  const paymentHash = sha256(secret)

  const { ln2tbtcContract, userAddress } = useContext(Web3Context);
  const [waitingForPayment, setWaitingForPayment] = useState(true);
  const [invoice, setInvoice] = useState<string>("Loading...");
  useEffect(()=>{
    fetch(`${operator.publicUrl}/tbtc2ln/invoice/${userAddress?.toLowerCase()}/${paymentHash}`).then(res=>res.json()).then((res:APIResponse)=>{
      try {
        const decodedInvoice = decode(res.invoice);
        if(decodedInvoice.paymentHash.toString('hex') !== paymentHash){
          throw new Error("Payment hashes don't match")
        }
        if(BigInt(decodedInvoice.valueSat)>BigInt(lnAmount)){
          throw new Error("Amount requested in invoice is too high")
        }
        setInvoice(res.invoice)
      } catch (e) {
        setInvoice("There was a problem with the invoice provided by the Liquidity Provider")
      }
    })
    ln2tbtcContract.events.LN2TBTCOperatorLockedTBTC({}, (_, event)=>{
      if(event.returnValues.userAddress === userAddress && event.returnValues.paymentHash === paymentHash){
        setWaitingForPayment(false)
      }
    })
  }, [])

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__invoice invoice">
            <form action="#" className="invoice__form">
              <div className="invoice__title">
                Pay Lightning Network invoice
              </div>
              <ContentBlock label="Invoice">
                <TextQR text={invoice} />
              </ContentBlock>
              <div className="invoice__note">
                Note: Funds will be locked for a few days if this transaction gets
                reverted
              </div>
              {waitingForPayment?
              <ActionButton text="Waiting for Payment" type="loading" />
              :
              <ActionButton text="Finish swap" type="primary" onClick={()=>{
                ln2tbtcContract.methods.claimTBTCPayment('0x'+paymentHash, '0x'+secret.toString('hex')).send({
                  from:userAddress!
                })
              }}/>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePane;
