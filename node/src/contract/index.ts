import Web3 from "web3";
import contractABI from './LN2tBTC.json';
import type { AbiItem } from "web3-utils";
import {ln2tbtcAddress} from './deployedAddresses'
import {Ln2tbtcContract} from './types'

// Project id should be hidden but whatever, I have a free account that is worthless
/*
export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/a94d8fec07d14f058824938b13ad64b3"
  )
);
*/
const web3ws = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/a94d8fec07d14f058824938b13ad64b3"
  )
);
const contract = new web3ws.eth.Contract(
    contractABI.abi as AbiItem[],
    ln2tbtcAddress
  ) as Ln2tbtcContract;

export default contract

