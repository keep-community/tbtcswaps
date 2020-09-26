import React, { useState } from "react";
import Footer from "./views/Footer/Footer";
import AlertDialog from "./views/AlertDialog/AlertDialog";
import Header from "./views/Header";
import Body from "./views/Body";
import Web3 from "web3";
import { Web3Provider } from "./ethereum";
import "./css/App.css";

function App() {
  const [web3, setWeb3] = useState<Web3Provider>(null);
  const [walletError, setWalletError] = useState<null | React.ReactElement<
    any,
    any
  >>(null);
  if (web3 === null) {
    // Auto-login if the ethereum provider has already approved us before
    window.ethereum?.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        setWeb3(new Web3(window.ethereum as any));
      }
    });
  }
  const connectWallet = () => {
    if (web3 !== null) {
      throw new Error("Wallet already connected");
    }
    if (window.ethereum === undefined) {
      setWalletError(
        <>
          You must have MetaMask installed to use this product, get it{" "}
          <a href="https://metamask.io/">here</a>
        </>
      );
      return;
    }
    window.ethereum
      .enable()
      .then(() => setWeb3(new Web3(window.ethereum as any)));
  };
  return (
    <div className="wrapper" /* className={styles.wrapper} */>
      <Header web3={web3} />
      <Body {...{ web3, connectWallet }} />
      <Footer />
      <AlertDialog
        title="Error"
        open={walletError !== null}
        handleClose={() => setWalletError(null)}
      >
        {walletError ?? <>Good</>}
      </AlertDialog>
    </div>
  );
}

export default App;