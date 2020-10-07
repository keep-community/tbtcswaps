import React, { useState, useContext, useEffect } from "react";
import Web3Context from "../../Web3Context";
import ActionButton from "../Widget/common/ActionButton";
import Modal from "../Modal";

function wrapJSX(elem:React.ReactElement){
    return <div className="wrapper-content">
      <div className="container">
        <div className="content">
        <div className="box-operation">
            {elem}
        </div>
        </div>
      </div>
    </div>
}

const Revert: React.FC<{
    paymentHash:null|string,
    operation:"revertLn2tbtc"|"revertTbtc2ln"
}> = ({
    paymentHash,
    operation
}) => {
    const [error, setError] = useState<null|string>(null);
    if(paymentHash===null){
        setError("The quey parameter paymentHash must be set, this URL is incorrect")
        throw new Error("No paymentHash query param")
    }
    const { web3, connectWallet, ln2tbtcContract, userAddress } = useContext(Web3Context);
    const [isConnectedMetamask, setIsConnectedMetamask] = useState(web3 !== null);
    const [timeout, setTimeout] = useState<null|number>(null);
    const [ln2tbtcOperatorLocked, setln2tbtcOperatorLocked] = useState<number>(0);
    useEffect(() => {
        setIsConnectedMetamask(web3 !== null);
        if(userAddress!==null){
            if(operation==="revertTbtc2ln"){
                ln2tbtcContract.methods.tbtcSwaps(userAddress, paymentHash).call().then(
                    ({timeoutTimestamp})=>{
                        if(timeoutTimestamp === '0'){
                            setError("Swap doesn't exist, can't be reverted (maybe paymentHash param is wrong?)")
                        } else {
                            setTimeout(Number(timeoutTimestamp))
                        }
                    })
            } else {
                const timeoutPeriod = 60*60; // 1 hour
                ln2tbtcContract.methods.lnSwaps(userAddress, paymentHash).call().then(
                    ({startTimestamp, tBTCLockTimestamp})=>{
                        if(startTimestamp === '0'){
                            setError("Swap doesn't exist, can't be reverted (maybe paymentHash param is wrong?)")
                        } else {
                            setln2tbtcOperatorLocked(Number(tBTCLockTimestamp))
                            setTimeout(Number(startTimestamp)+timeoutPeriod)
                        }
                    })
            }
        }
    }, [web3]);
    if(error !== null){
        return wrapJSX(<Modal
            title="Error"
            isOpen={true}
            buttonText={"Go back to main page"}
            onButtonClick={()=>{
                window.location.replace("/")
            }}
          >
            {error}
            <br />
            <br />
            If you believe this is a mistake please contact me on discord (@corollari#2127)
          </Modal>)
    }
    if(isConnectedMetamask===true && userAddress!==null){
        const currentTime = Date.now()/1000;
        if(timeout === null){
            return wrapJSX(<ActionButton text="Getting swap info" type="loading" />)
        } else if(timeout < currentTime){
            setError(`You must wait until ${error} to be able to revert your swap. Please come back here after that time.`)
            return <></>
        } else if(operation === "revertTbtc2ln"){
            return wrapJSX(<ActionButton
                text="Revert"
                onClick={()=>{
                    ln2tbtcContract.methods.revertTBTC2LNSwap(paymentHash).send({
                        from:userAddress
                    })
                }}
                />)
        } else if(operation === "revertLn2tbtc"){
            if(ln2tbtcOperatorLocked===0){
                return wrapJSX(<ActionButton
                    text="Revert"
                    onClick={()=>{
                        ln2tbtcContract.methods.revertLN2TBTCSwap(paymentHash).send({
                            from:userAddress
                        })
                    }}
                    />)
            } else {
                return wrapJSX(
                <><div>
                    The operator has already locked their funds, you must complete the swap<br />
                    Please make sure that you are on the same device that you used to start the swap process
                </div>
                <ActionButton
                    text="Finish swap"
                    onClick={()=>{
                        const secret = localStorage.getItem(paymentHash.substr(2));
                        if(secret === null){
                            setError("Unable to find the secret on localStorage. Please make sure you are on the same device/browser that you used to start the swap")
                        } else {
                            ln2tbtcContract.methods.claimTBTCPayment(paymentHash, `0x${secret}`).send({
                                from:userAddress
                            })
                        }
                    }}
                    />
                </>)
            }
        } else {
            return wrapJSX(<>Contact us</>)
        }
    } else {
        return wrapJSX(<ActionButton
        onClick={()=>connectWallet()}
        text="Connect wallet"
        type="secondary"
        className="exchange__button"
      />)
    }
}
export default Revert