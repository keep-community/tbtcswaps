import React from 'react'
import styles from './styles.module.css'
import Widget from "../Widget/Widget";
import { Web3Provider } from "../../ethereum";

interface BodyType {
    web3: Web3Provider;
    connectWallet: () => void;
}

const Body: React.FC<BodyType> = ({ web3, connectWallet }) => {
    return (
        <div className={styles['wrapper-content']} >
            adsdasasd
           {/*  <Widget {...{ web3, connectWallet }} /> */}
        </div>
    )
}

export default Body