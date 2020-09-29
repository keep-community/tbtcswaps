import React, { useState, useContext, useEffect } from "react";
import OperatePane from "./OperatePane";
import Web3Context from "../../../../../Web3Context";
import {
  ln2tbtcAddress,
} from "../../../../../contracts/deployedAddresses";
import {
  Operator,
  Ln2tbtcContract,
  ERC20Contract,
} from "../../../../../ethereum";
import {convertToUint} from '../../../utils'

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
  const { web3, userAddress, ln2tbtcContract, tbtcContract } = useContext(Web3Context);

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
      (op:Operator)=>registerOperator(op, userAddress!, ln2tbtcContract, tbtcContract)
    }/>
  }
};

export default Operate;
