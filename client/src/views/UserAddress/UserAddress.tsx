import React, { useContext, useState, useEffect } from "react";
import "./UserAddress.css";
import Web3Context from '../../Web3Context'

export default function UserAddress() {
  const { web3 } = useContext(Web3Context)
  const [selectedAddress, setSelectedAddress] = useState<string>()

  useEffect(() => {
    setSelectedAddress(web3 === null ? undefined : (web3.currentProvider as any).selectedAddress)
    console.log('called!!!!!!', web3)
  }, [web3])

  return (
    <div className={`header__connect connect connect--${selectedAddress ? 'success' : 'no'}`}>
      <div className="connect__label">{selectedAddress ? 'Mainnet:' : 'Connect Wallet'}</div>
      {selectedAddress && <div className="connect__text">{selectedAddress.substring(0, 6)}...{selectedAddress.substring(selectedAddress.length - 4)}</div>}
      <div className="connect__status"><span></span></div>
    </div >
  );
}
