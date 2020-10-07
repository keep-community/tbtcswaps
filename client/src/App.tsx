import React from "react";
import Footer from "./views/Footer";
import Header from "./views/Header";
import Body from "./views/Body";
import Revert from "./views/Revert";
import "./css/App.css";
import { Web3Provider } from "./Web3Context";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const operation = urlParams.get('operation');
  const paymentHash = urlParams.get('paymentHash');
  if (operation === null) {
    return (
      <div className="wrapper">
        <Web3Provider>
          <Header />
          <Body />
          <Footer />
        </Web3Provider>
      </div>
    );
  } else if (operation === "revertLn2tbtc" || operation === "revertTbtc2ln") {
    return (
      <div className="wrapper">
        <Web3Provider>
          <Revert operation={operation} paymentHash={paymentHash}/>
        </Web3Provider>
      </div>
    );
  } else {
    return <span>Operation not valid</span>
  }
}

export default App;
