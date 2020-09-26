import React from 'react'
import Widget from "../Widget";
import { Web3Provider } from "../../ethereum";

interface BodyProps {
    web3: Web3Provider;
    connectWallet: () => void;
}

const Body: React.FC<BodyProps> = ({ web3, connectWallet }) => {
    return (
        <div className='wrapper-content' >
            <div className="container">
                <div className="content">
                    <Widget {...{ web3, connectWallet }} />
                </div>
            </div>
        </div>
    )
}

export default Body