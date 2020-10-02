import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import contractABI from "./LN2tBTC.json";
import { ln2tbtcAddress } from "./deployedAddresses";
import { Ln2tbtcContract } from "./types";

const {ETH_PRIVATEKEY, INFURA_ID } = process.env;
if (ETH_PRIVATEKEY === undefined || INFURA_ID === undefined) {
  throw new Error("Environment variables ETH_PRIVATEKEY and INFURA_ID are not defined");
}

// Project id should be hidden but whatever, I have a free account that is worthless
export const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${INFURA_ID}`
  )
);
export const contract = new web3.eth.Contract(
  contractABI.abi as AbiItem[],
  ln2tbtcAddress
) as Ln2tbtcContract;

const { address } = web3.eth.accounts.wallet.add(ETH_PRIVATEKEY);
export { address as ethAddress };
