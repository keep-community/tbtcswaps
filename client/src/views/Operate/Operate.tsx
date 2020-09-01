import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ln2tbtcABI from '../../contracts/LN2tBTC.json'
import tbtcABI from '../../contracts/IERC20.json'
import type { AbiItem } from 'web3-utils'
import { tbtcAddress, ln2tbtcAddress } from '../../contracts/deployedAddresses'
import lnLogo from "../Swap/lightning.png";
import tbtcLogo from "../Swap/tBTC.png";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputField from "./InputField"
import { Web3Provider, Operator, Ln2tbtcContract, ERC20Contract } from "../../ethereum";

let ln2tbtcContract: Ln2tbtcContract | null = null;
let tbtcContract: ERC20Contract | null = null;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      'margin-button':{
        marginTop:'1em'
      }
    })
);

function generateInputHandler(state:Object, setState:Function, field:string){
  return (newValue:string)=>setState({
    ...state,
    [field]:newValue
  })
}

async function registerOperator(operatorInfo:Operator, operatorAddress:string, ln2tbtcContract: Ln2tbtcContract, tbtcContract: ERC20Contract){
  if(Number(operatorInfo.tBTCBalance)!==0){
    await tbtcContract.methods.approve(ln2tbtcAddress, operatorInfo.tBTCBalance).send({
      from: operatorAddress
    });
  }
  await ln2tbtcContract.methods.operatorRegister(operatorInfo.tBTCBalance, operatorInfo.lnBalance, operatorInfo.linearFee, operatorInfo.constantFee, operatorInfo.publicUrl).send({
    from: operatorAddress
  });
}

export default function Operate(props: { web3: Web3Provider }) {
  const [operatorInfo, setOperatorInfo] = React.useState<Operator | null>(null);
  const classes = useStyles();
  if (props.web3 === null) {
    return <></>
  }
  // Avoid initializing contracts several times
  if (ln2tbtcContract === null) {
    ln2tbtcContract = new props.web3.eth.Contract(ln2tbtcABI.abi as AbiItem[], ln2tbtcAddress);
  }
  if (tbtcContract === null) {
    tbtcContract = new props.web3.eth.Contract(tbtcABI.abi as AbiItem[], tbtcAddress);
  }
  const userAddress = (props.web3.currentProvider as any).selectedAddress;
  if (operatorInfo === null) {
    ln2tbtcContract.methods.operators(userAddress).call().then(setOperatorInfo);
    return <>Loading...</>
  }
  if (operatorInfo.exists) {
    return <Grid container spacing={3}>
    </Grid>
  } else {
    return <><Grid container spacing={3}>
      <InputField name="LN Balance" logo={lnLogo} onChange={generateInputHandler(operatorInfo, setOperatorInfo, "lnBalance")}/>
      <InputField name="tBTC Balance" logo={tbtcLogo} onChange={generateInputHandler(operatorInfo, setOperatorInfo, "tBTCBalance")}/>
      <InputField name="Linear Fee" onChange={generateInputHandler(operatorInfo, setOperatorInfo, "linearFee")}/>
      <InputField name="Constant Fee" onChange={generateInputHandler(operatorInfo, setOperatorInfo, "constantFee")}/>
      <InputField name="Node URL" type="text" onChange={generateInputHandler(operatorInfo, setOperatorInfo, "publicUrl")}/>
    </Grid>
      <Button className={classes["margin-button"]} variant="contained" color="primary" size="large" onClick={()=>registerOperator(operatorInfo, userAddress, ln2tbtcContract!, tbtcContract!)}>
        Register
      </Button>
    </>
  }
}
