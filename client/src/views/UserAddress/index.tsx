import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import Modal from '../Modal'

export default function UserAddress() {
  const { web3, connectWallet } = useContext(Web3Context);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [displayNoMetamaskModal, setDisplayNoMetamaskModal] = useState(false);

  useEffect(() => {
    setSelectedAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  return (
    <>
      <div
        className={`header__connect connect connect--${selectedAddress ? "success" : "no"
          }`}
        onClick={() => (!selectedAddress ? connectWallet((errType) => {
          if (errType === 'NO_METAMASK')
            setDisplayNoMetamaskModal(true)
        }) : null)}
      >
        <div className="connect__label">
          {selectedAddress ? "Mainnet:" : "Connect Wallet"}
        </div>
        {selectedAddress && (
          <div className="connect__text">
            {selectedAddress.substring(0, 6) +
              "..." +
              selectedAddress.substring(selectedAddress.length - 4)}
          </div>
        )}
        <div className="connect__status">
          <span></span>
        </div>
      </div>
      <Modal
        isOpen={displayNoMetamaskModal}
        type="error"
        title={"Wallet not found"}
        buttonText={"Okay"}
        onButtonClick={() => setDisplayNoMetamaskModal(false)}
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
  );
}
