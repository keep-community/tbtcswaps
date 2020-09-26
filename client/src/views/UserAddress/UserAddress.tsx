import React from "react";
import { Web3Provider } from "../../ethereum";
import "./UserAddress.css";

export default function UserAddress(props: { web3: Web3Provider }) {
  const selectedAddress = props.web3 === null ? "" : (props.web3.currentProvider as any).selectedAddress
  console.log(selectedAddress)
  return (
    <div className={`header__connect connect connect--${selectedAddress === undefined ? 'success' : 'no'}`}>
      <div className="connect__label">{selectedAddress ? 'Mainnet:' : 'Connect Wallet'}</div>
      {selectedAddress && <div className="connect__text">{selectedAddress.substring(0, 6)}...{selectedAddress.substring(selectedAddress.length - 4)}</div>}
      <div className="connect__status"><span></span></div>
    </div >
  );
}
