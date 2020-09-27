import React, { useState, useCallback, useEffect } from 'react'
import Web3 from "web3";
import { Web3Provider as Web3ProviderType } from "../ethereum";

const Web3Context = React.createContext<{
    web3: Web3ProviderType
    connectWallet: (
        onError: (errType: 'NO_METAMASK' | 'ALREADY_CONNECTED') => void,
        onSuccess: () => void,
    ) => void
}>({
    web3: null,
    connectWallet: () => null
});

const Web3Provider: React.FC = (props) => {
    const [web3, setWeb3] = useState<Web3ProviderType>(null)

    useEffect(() => {
        const initialize = async () => {
            console.log('started looking for web3')
            const accounts = await window.ethereum?.request({ method: "eth_accounts" })
            if (accounts && accounts.length > 0) {
                setWeb3(new Web3(window.ethereum as any))
            }
        }
        initialize()
    }, [])

    const connectWallet = useCallback((
        onError: (errType: 'NO_METAMASK' | 'ALREADY_CONNECTED') => void,
        onSuccess: () => void,
    ) => {
        if (web3 !== null) {
            onError('ALREADY_CONNECTED')
        }
        if (window.ethereum === undefined) {
            onError('NO_METAMASK')
            return;
        }
        window.ethereum
            .enable()
            .then(() => {
                setWeb3(new Web3(window.ethereum as any))
                onSuccess()
            });
    }, [web3]);

    return (
        <Web3Context.Provider value={{
            web3,
            connectWallet
        }}>
            { props.children}
        </Web3Context.Provider >
    )
}

export {
    Web3Provider
}

export default Web3Context