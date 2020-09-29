import React, { useState, useContext, useEffect } from "react";

import OperatePane from "./OperatePane";

import Web3Context from "../../../../../Web3Context";

import ln2tbtcABI from "../../../../../contracts/LN2tBTC.json";
import tbtcABI from "../../../../../contracts/IERC20.json";
import type { AbiItem } from "web3-utils";
import {
  tbtcAddress,
  ln2tbtcAddress,
} from "../../../../../contracts/deployedAddresses";

import {
  Operator,
  Ln2tbtcContract,
  ERC20Contract,
} from "../../../../../ethereum";

let ln2tbtcContract: Ln2tbtcContract | null = null;
let tbtcContract: ERC20Contract | null = null;

function convertToUint(amount:string, tokenDecimals:number){
    let [int, decimals] = amount.split('.');
    decimals = decimals ?? '';
    int = int.replace(/^0+/, '');
    decimals = decimals.padEnd(tokenDecimals, '0')
    if(decimals.length > tokenDecimals){
      throw new Error("Too many decimals were provided")
    }
    return int + decimals;
}

async function registerOperator(
  operatorInfo: Operator,
  operatorAddress: string,
  ln2tbtcContract: Ln2tbtcContract,
  tbtcContract: ERC20Contract
) {
  if (Number(operatorInfo.tBTCBalance) !== 0) {
    await tbtcContract.methods
      .approve(ln2tbtcAddress, operatorInfo.tBTCBalance)
      .send({
        from: operatorAddress,
      });
  }
  await ln2tbtcContract.methods
    .operatorRegister(
      convertToUint(operatorInfo.tBTCBalance, 18),
      convertToUint(operatorInfo.lnBalance, 8),
      convertToUint(operatorInfo.linearFee, 8+2), // Transform to %
      convertToUint(operatorInfo.constantFee, 8),
      operatorInfo.publicUrl
    )
    .send({
      from: operatorAddress,
    });
}

const Operate: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [operatorInfo, setOperatorInfo] = React.useState<Operator | null>(null);
  const { web3 } = useContext(Web3Context);

  useEffect(() => {
    // Avoid initializing contracts several times
    if (web3 === null) return;
    if (ln2tbtcContract === null) {
      ln2tbtcContract = new web3.eth.Contract(
        ln2tbtcABI.abi as AbiItem[],
        ln2tbtcAddress
      );
    }
    if (tbtcContract === null) {
      tbtcContract = new web3.eth.Contract(
        tbtcABI.abi as AbiItem[],
        tbtcAddress
      );
    }
  }, [web3]);

  const [userAddress, setUserAddress] = useState<string>();

  useEffect(() => {
    setUserAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  /*
  useEffect(() => {
    if (operatorInfo === null && ln2tbtcContract !== null && userAddress) {
      ln2tbtcContract.methods
        .operators(userAddress)
        .call()
        .then(setOperatorInfo)
        .catch((err) => setErrorMsg(err.message));
    }
  }, [userAddress, operatorInfo]);
  */

  if(!!errorMsg){
    return <span>{errorMsg}</span>
  } else {
    return <OperatePane 
    handleInputChange={(form) => {}}
    isConnected={web3!==null}
    registerOperator={
      (op:Operator)=>registerOperator(op, userAddress!, ln2tbtcContract!, tbtcContract!)
    }/>
  }
};

export default Operate;
