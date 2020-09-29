import React, { useState, useContext } from "react";
import ActionButton from "../../../common/ActionButton";
import ContentBlock from "../../../common/ContentBlock";
import { Ln2tbtcContract, ERC20Contract } from "../../../../../ethereum";
import { decode } from "@node-lightning/invoice";
import {
  ln2tbtcAddress,
} from "../../../../../contracts/deployedAddresses";
import Web3Context from "../../../../../Web3Context";

async function createSwap(
  invoice: string,
  tBTCAmount: string,
  operatorAddress: string,
  userAddress: string,
  ln2tbtcContract: Ln2tbtcContract,
  tbtcContract:ERC20Contract
) {
  const {paymentHash} = decode(invoice);
  await tbtcContract.methods.approve(ln2tbtcAddress, tBTCAmount).send({
    from: userAddress,
  });
  await ln2tbtcContract.methods
    .createTBTC2LNSwap(paymentHash.toString('hex'), tBTCAmount, operatorAddress, invoice)
    .send({
      from: userAddress,
    });
}

const InvoiceTbtc2LN: React.FC<{
  operatorAddress:string,
  tBTCAmount: string,
}> = ({tBTCAmount, operatorAddress}) => {
  const [invoice, setInvoice] = useState<string>("");
  const [swapping, setSwapping] = useState<boolean>(false);
  let error = false;
  let result: ReturnType<typeof decode>;
  if (invoice !== "") {
    try {
      result = decode(invoice);
    } catch (e) {
      error = true;
    }
  }
  const { ln2tbtcContract, tbtcContract, userAddress } = useContext(Web3Context);

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__invoice invoice">
            <form action="#" className="invoice__form">
            <div className="invoice__title">
                Provide Lightning Network invoice
              </div>
              <ContentBlock label="Invoice" />
              {//<ContentBlock label="Swap details" />
            }
              <div className="invoice__note">
                Note: Funds will be locked for 3 days if this transaction gets
                reverted
              </div>
              {swapping ?
                <ActionButton text="Waiting for Payment" type="loading" />
                :
                <ActionButton text="Swap" type="primary" onClick={()=>createSwap(invoice, tBTCAmount, operatorAddress, userAddress!, ln2tbtcContract, tbtcContract)}/>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTbtc2LN;
