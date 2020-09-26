import React from "react";
import { Web3Provider } from "../../ethereum";
import "./UserAddress.css";

export default function UserAddress(props: { web3: Web3Provider }) {
  const selectedAddress = props.web3 === null ? "" : (props.web3.currentProvider as any).selectedAddress
  console.log(selectedAddress)
  return (
    <div className="header__connect connect connect--success">
      {selectedAddress && <div className="connect__label">Mainnet:</div>}
      <div className="connect__text">{
        selectedAddress ? `${selectedAddress.substring(0, 6)}...${selectedAddress.substring(selectedAddress.length - 4)}`
          : 'No wallet'
      }</div>
      <div className="connect__status"><span></span></div>
    </div >
  );
}
