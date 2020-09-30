import React, { useState, useContext, useEffect } from "react";

import SwapPane from "./SwapPane";
import InvoiceLN2tbtc from "./InvoiceLN2tbtc";
import Invoicetbtc2ln from "./Invoicetbtc2ln";
import {randomBytes} from 'crypto';

import { Operator, Ln2tbtcContract } from "../../../../../ethereum";
import Web3Context from "../../../../../Web3Context";
import {convertToUint, addDecimalsToUint, sha256} from '../../../utils'

import Modal from "../../../../Modal";

type ExtendedOperator = Operator&{operatorAddress:string}
async function getOperators(contract:Ln2tbtcContract): Promise<ExtendedOperator[]> {
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
const tokenDecimals = {
  tbtc: 18,
  ln: 8
}

function removeFees(amount: bigint, linearFee: bigint, rawConstantFee: bigint, fromName:'tbtc'|'ln') {
  const diffNominator = (BigInt(10)**BigInt(tokenDecimals['tbtc']-tokenDecimals['ln']))
  let constantFee:bigint
  if(fromName==='ln'){
    constantFee = rawConstantFee
  } else {
    constantFee = rawConstantFee*diffNominator
  }
  const e8 = BigInt(10)**BigInt(8)
  const computed = ((amount - constantFee) * e8) / (e8 + linearFee);
  if(fromName==='ln'){
    return computed*diffNominator
  } else {
    return computed/diffNominator
  }
}

function calculateLowestSwap(
  operators: ExtendedOperator[],
  fromAmountRaw: string,
  fromName: 'tbtc'|'ln'
) {
  const fromAmount = BigInt(convertToUint(fromAmountRaw, tokenDecimals[fromName]))
  const selectedOps = operators
    .map((op) => {
      const totalProvided = removeFees(
        fromAmount,
        BigInt(op.linearFee),
        BigInt(op.constantFee),
        fromName
      );
      return {
        ...op,
        totalProvided,
      };
    })
    .filter((op) => {
      const opBalance = fromName==='ln' ? op.tBTCBalance : op.lnBalance;
      return BigInt(opBalance) >= op.totalProvided && op.totalProvided > 0;
    })
    .sort((a, b) => Number(b.totalProvided - a.totalProvided)); // From highest to lowest
  if (selectedOps.length === 0) {
    return undefined;
  } else {
    return selectedOps[0];
  }
}

const Swap: React.FC = () => {
  const { web3, connectWallet, ln2tbtcContract, userAddress } = useContext(Web3Context);
  const [isConnectedMetamask, setIsConnectedMetamask] = useState(web3 !== null);
  useEffect(() => {
    setIsConnectedMetamask(web3 !== null);
  }, [web3]);
  const [secret, setSecret] = useState<Buffer>();
  useEffect(() => {
    setSecret(randomBytes(32));
  }, []);

  const [errModalName, setErrModalName] = useState<string>();

  const [fromAmount, setFromAmount] = useState("");
  const [fromName, setFromName] = useState<'tbtc'|'ln'>('tbtc');

  const [stage, setStage] = useState<"initial" | "invoice">("initial");

  const [operators, setOperators] = React.useState<ExtendedOperator[] | null>(null);
  useEffect(() => {
    getOperators(ln2tbtcContract).then(setOperators);
  }, [ln2tbtcContract]);
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
      const toDecimals = tokenDecimals[fromName==='tbtc'?'ln':'tbtc']
      toAmount=addDecimalsToUint(selectedOperator.totalProvided.toString(), toDecimals)
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
          onSwapClick={async () => {
            if (!notEnoughLiquidityError && selectedOperator!==undefined) {
              if(fromName==='ln'){
                await ln2tbtcContract.methods.createLN2TBTCSwap('0x'+sha256(secret!), selectedOperator.operatorAddress, selectedOperator.totalProvided.toString()).send({
                  from:userAddress!,
                  value:'1'.padEnd(19, '0')
                })
              }
              setStage("invoice");
            }
          }}
          isConnected={isConnectedMetamask}
          handleInputChange={(_, value) => {
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
    (stage === "invoice" && selectedOperator !== undefined && (fromName === 'ln' ? <InvoiceLN2tbtc lnAmount={convertToUint(fromAmount, tokenDecimals['ln'])} secret={secret!} operator={selectedOperator} /> : <Invoicetbtc2ln operator={selectedOperator} tBTCAmount={convertToUint(fromAmount, tokenDecimals['tbtc'])} />)) || <span>Contact us.</span>
  );
};

export default Swap;
