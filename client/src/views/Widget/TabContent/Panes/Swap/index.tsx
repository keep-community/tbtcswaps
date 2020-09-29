import React, { useState, useContext, useEffect } from "react";

import SwapPane from "./SwapPane";
import InvoiceLN2tbtc from "./InvoiceLN2tbtc";
import Invoicetbtc2ln from "./Invoicetbtc2ln";

import { Operator, Ln2tbtcContract } from "../../../../../ethereum";
import Web3 from "web3";
import ln2tbtcABI from "../../../../../contracts/LN2tBTC.json";
import type { AbiItem } from "web3-utils";
import { ln2tbtcAddress } from "../../../../../contracts/deployedAddresses";

import Web3Context from "../../../../../Web3Context";

import Modal from "../../../../Modal";

type ExtendedOperator = Operator&{operatorAddress:string}
async function getOperators(): Promise<ExtendedOperator[]> {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4"
    )
  );
  const contract = new web3.eth.Contract(
    ln2tbtcABI.abi as AbiItem[],
    ln2tbtcAddress
  ) as Ln2tbtcContract;
  const length = Number(await contract.methods.getOperatorListLength().call());
  const indexArray = Array.from(Array(length), (_, i) => i);
  const operators = await Promise.all(
    indexArray.map((index) =>
      contract.methods
        .operatorList(index)
        .call()
        .then((operatorAddress) =>
          contract.methods.operators(operatorAddress).call().then(op=>({
            ...op,
            operatorAddress
          }))
        )
    )
  );
  return operators;
}

function removeFees(amount: number, linearFee: number, constantFee: number) {
  return ((amount * 10 ** 8 - constantFee) * 10 ** 8) / (10 ** 8 + linearFee);
}

function calculateLowestSwap(
  operators: ExtendedOperator[],
  fromAmountRaw: string,
  fromName: 'tbtc'|'ln'
) {
  const fromAmount = Number(fromAmountRaw) //TODO: Change
  console.log(fromAmount);
  const selectedOps = operators
    .map((op) => {
      const totalProvided = removeFees(
        fromAmount,
        Number(op.linearFee),
        Number(op.constantFee)
      );
      console.log(totalProvided);
      return {
        ...op,
        totalProvided,
      };
    })
    .filter((op) => {
      const opBalance = fromName==='ln' ? op.tBTCBalance : op.lnBalance;
      return Number(opBalance) > op.totalProvided && op.totalProvided > 0;
    })
    .sort((a, b) => b.totalProvided - a.totalProvided); // From highest to lowest
  if (selectedOps.length === 0) {
    return undefined;
  } else {
    return selectedOps[0];
  }
}

const Swap: React.FC = () => {
  const { web3, connectWallet } = useContext(Web3Context);
  const [isConnectedMetamask, setIsConnectedMetamask] = useState(web3 !== null);
  useEffect(() => {
    setIsConnectedMetamask(web3 !== null);
  }, [web3]);

  const [errModalName, setErrModalName] = useState<string>();

  const [fromAmount, setFromAmount] = useState("");
  const [fromName, setFromName] = useState<'tbtc'|'ln'>('tbtc');

  const [stage, setStage] = useState<"initial" | "invoice">("initial");

  const [operators, setOperators] = React.useState<ExtendedOperator[] | null>(null);
  useEffect(() => {
    getOperators().then(setOperators);
  }, []);
  let selectedOperator: ReturnType<typeof calculateLowestSwap> | undefined;
  let notEnoughLiquidityError = false;
  let toAmount = '';
  if (fromAmount === '' || fromAmount === '0' || operators === null) {
    selectedOperator = undefined;
  } else {
    selectedOperator = calculateLowestSwap(operators, fromAmount, fromName);
    if (selectedOperator === undefined) {
      notEnoughLiquidityError = true;
    } else {
      toAmount=selectedOperator.totalProvided.toString()
    }
  }

  return (
    (stage === "initial" && (
      <>
        <SwapPane
          onConnectWalletClick={() => {
            connectWallet(
              (err) => {
                if (err === "NO_METAMASK") setErrModalName("NO_METAMASK");
              },
              () => setIsConnectedMetamask(true)
            );
          }}
          onSwapClick={() => {
            if (!notEnoughLiquidityError) {
              setStage("invoice");
            }
          }}
          isConnected={isConnectedMetamask}
          handleInputChange={(name, value) => {
            setFromAmount(value);
          }}
          handleFromNameChange={setFromName}
          notEnoughLiquidityError={notEnoughLiquidityError}
          lnAmount={fromName==='ln'?fromAmount:toAmount}
          tbtcAmount={fromName==='tbtc'?fromAmount:toAmount}
          noInputProvided={fromAmount===''||fromAmount==='0'}
        />
        <Modal
          isOpen={!!errModalName}
          type="error"
          title={"Wallet not found"}
          buttonText={"Okay"}
          onButtonClick={() => setErrModalName(undefined)}
        >
          <span>
            You must have MetaMask installed to use this product, get it{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://metamask.io/"
            >
              here
            </a>
            .
          </span>
        </Modal>
      </>
    )) ||
    (stage === "invoice" && selectedOperator !== undefined && (fromName === 'ln' ? <InvoiceLN2tbtc /> : <Invoicetbtc2ln operatorAddress={selectedOperator.operatorAddress} tBTCAmount={fromAmount} />)) || <span>Contact us.</span>
  );
};

export default Swap;
