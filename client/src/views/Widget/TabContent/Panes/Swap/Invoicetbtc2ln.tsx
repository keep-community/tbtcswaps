import React, { useState, useContext } from "react";
import ActionButton from "../../../common/ActionButton";
import ContentBlock from "../../../common/ContentBlock";
import { Ln2tbtcContract, ERC20Contract, ExtendedOperator } from "../../../../../ethereum";
import { decode } from "@node-lightning/invoice";
import {
  ln2tbtcAddress,
} from "../../../../../contracts/deployedAddresses";
import Web3Context from "../../../../../Web3Context";

interface APIResponse {
    "fee": number,
    "delay": number
}

async function createSwap(
  invoice: string,
  tBTCAmount: string,
  operatorURL:string,
  operatorAddress: string,
  userAddress: string,
  ln2tbtcContract: Ln2tbtcContract,
  tbtcContract:ERC20Contract
) {
  const {paymentHash, valueSat} = decode(invoice);
  if(valueSat===null){
    window.alert("Invoice must specify an amount to be paid")
    throw new Error("Invoice must specify an amount to be paid")
  }
  const delay = await fetch(`${operatorURL}/ln2tbtc/lockTime/${invoice}`).then(res=>res.json())
  .then((res:APIResponse)=>res.delay);
  if(delay > (5*24*60*60)){
    throw new Error("Delay is too large")
  }
  await tbtcContract.methods.approve(ln2tbtcAddress, tBTCAmount).send({
    from: userAddress,
  });
  await ln2tbtcContract.methods
    .createTBTC2LNSwap('0x'+paymentHash.toString('hex'), tBTCAmount, operatorAddress, delay.toString(), invoice)
    .send({
      from: userAddress,
    });
}

const InvoiceTbtc2LN: React.FC<{
  operator:ExtendedOperator,
  tBTCAmount: string,
}> = ({tBTCAmount, operator}) => {
  const [invoice, setInvoice] = useState<string>("");
  const [swapping, setSwapping] = useState<boolean>(false);
  let invoiceError = false;
  let decodedInvoice: ReturnType<typeof decode>;
  if (invoice !== "") {
    try {
      decodedInvoice = decode(invoice);
    } catch (e) {
      invoiceError = true;
    }
  }
  const { ln2tbtcContract, tbtcContract, userAddress } = useContext(Web3Context);
  console.log('provided', operator.totalProvided)

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__invoice invoice">
            <form action="#" className="invoice__form">
            <div className="invoice__title">
                Provide Lightning Network invoice
              </div>
              <div>
                The lightning invoice created should request a payment of {operator.totalProvided.toString()} sats
              </div>
              <ContentBlock
              label="Invoice"
              onChange={setInvoice}
              error={invoiceError?"Invoice is invalid":undefined}
              />
              <div className="invoice__note">
                Note: Funds will be locked for a few days if this transaction gets
                reverted
              </div>
              {swapping ?
                <ActionButton text="Waiting for Payment" type="loading" />
                :
                invoiceError?
                  <ActionButton text="Invoice is incorrect" type="primary" disabled={true}/>
                  :
                  <ActionButton text="Swap" type="primary" onClick={async ()=>{
                    setSwapping(true)
                    try{
                      await createSwap(invoice, tBTCAmount, operator.publicUrl, operator.operatorAddress, userAddress!, ln2tbtcContract, tbtcContract)
                    } finally{
                      setSwapping(false);
                    }
                  }}/>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTbtc2LN;
