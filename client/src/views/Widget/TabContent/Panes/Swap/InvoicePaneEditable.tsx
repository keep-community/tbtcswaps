import React, { useState } from "react";
import ActionButton from "../../../common/ActionButton";
import ContentBlock from "../../../common/ContentBlock";
import Web3 from "web3";
import { Ln2tbtcContract, ERC20Contract } from "../../../../../ethereum";
import { decode } from "@node-lightning/invoice";
import ln2tbtcABI from "../../../../../contracts/LN2tBTC.json";
import tbtcABI from "../../../../../contracts/IERC20.json";
import type { AbiItem } from "web3-utils";
import {
  tbtcAddress,
  ln2tbtcAddress,
} from "../../../../../contracts/deployedAddresses";

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

const InvoicePane: React.FC = () => {
  const [invoice, setInvoice] = useState<string>("");
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
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__invoice invoice">
            <form action="#" className="invoice__form">
              <div className="invoice__title">
                Pay Lightning Network invoice
              </div>
              <ContentBlock label="Invoice" />
              <ContentBlock label="Swap details" />
              <div className="invoice__note">
                Note: Funds will be locked for 3 days if this transaction gets
                reverted
              </div>
              <ActionButton text="Waiting for Payment" type="loading" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePane;
