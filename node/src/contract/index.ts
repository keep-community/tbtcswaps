import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import contractABI from "./LN2tBTC.json";
import { ln2tbtcAddress } from "./deployedAddresses";
import { Ln2tbtcContract } from "./types";

// Project id should be hidden but whatever, I have a free account that is worthless
export const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://rinkeby.infura.io/ws/v3/3ddcb4abe3bf4331897be020bb6a36f0"
  )
);
export const contract = new web3.eth.Contract(
  contractABI.abi as AbiItem[],
  ln2tbtcAddress
) as Ln2tbtcContract;

const privkey = process.env.PRIVKEY
if(privkey === undefined){
  throw new Error("Environment variable PRIVKEY is not defined")
}
const { address } = web3.eth.accounts.wallet.add(privkey);
export { address as ethAddress };
