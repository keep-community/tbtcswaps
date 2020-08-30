import React, { useState } from "react";
import Footer from "./views/Footer/Footer";
import Widget from "./views/Widget/Widget";
import AlertDialog from "./views/AlertDialog/AlertDialog";
import Web3 from "web3";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  return (
    <div className="App">
      <Widget />
      <Footer />
    </div>
  );
}

export default App;
