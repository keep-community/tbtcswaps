import React, { useState, useContext, useEffect } from "react";

import SwapPane from "./SwapPane";
import InvoicePane from "./InvoicePaneEditable";

import { Operator, Ln2tbtcContract } from "../../../../../ethereum";
import Web3 from "web3";
import ln2tbtcABI from "../../../../../contracts/LN2tBTC.json";
import type { AbiItem } from "web3-utils";
import { ln2tbtcAddress } from "../../../../../contracts/deployedAddresses";

import Web3Context from "../../../../../Web3Context";

import Modal from "../../../../Modal";

async function getOperators(): Promise<Operator[]> {
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
          contract.methods.operators(operatorAddress).call()
        )
    )
  );
  return operators;
}

function removeFees(amount: number, linearFee: number, constantFee: number) {
  return ((amount * 10 ** 8 - constantFee) * 10 ** 8) / (10 ** 8 + linearFee);
}

function calculateLowestSwap(
  operators: Operator[],
  fromAmount: number,
  fromLN: boolean
) {
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
      const opBalance = fromLN ? op.tBTCBalance : op.lnBalance;
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

  const [tbtcAmount, setTbtcAmount] = useState("");
  const [lnAmount, setLnAmount] = useState("");
  const [fromName, setFromName] = useState("");

  const [stage, setStage] = useState<"initial" | "invoice">("initial");

  let error = false;
  const [operators, setOperators] = React.useState<Operator[] | null>(null);
  useEffect(() => {
    getOperators().then(setOperators);
  }, []);
  /*
    let selectedOperator: ReturnType<typeof calculateLowestSwap> | undefined;
    if (fromAmount === null || fromAmount === 0 || operators === null) {
        selectedOperator = undefined;
    } else {
        selectedOperator = calculateLowestSwap(operators, fromAmount, fromLN);
        if (selectedOperator === undefined) {
            error = true;
        }
    }
    */

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
            if (!error) {
              setStage("invoice");
            }
          }}
          isConnected={isConnectedMetamask}
          handleInputChange={(name, value) => {
            if (name === "tbtc") setTbtcAmount(value);
            else if (name === "ln") setLnAmount(value);
          }}
          handleFromNameChange={setFromName}
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
    (stage === "invoice" && <InvoicePane />) || <span>Contact us.</span>
  );
};

export default Swap;
