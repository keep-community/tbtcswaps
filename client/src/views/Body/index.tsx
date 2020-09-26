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
                    <div className="heading">
                        <div className="heading__title">
                            <h1>tBTC Swap Engine</h1>
                        </div>
                        <div className="heading__text">Power of tBTC with Lightning speed</div>
                    </div>
                    <Widget {...{ web3, connectWallet }} />
                </div>
            </div>
        </div>
    )
}

export default Body