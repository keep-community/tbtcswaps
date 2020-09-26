import React, { useState } from 'react'
import { Web3Provider } from "../../ethereum";
import TabHeader from './TabHeader'
import TabContent from './TabContent'


const Widget: React.FC<{ web3: Web3Provider }> = ({ web3 }) => {
    const defaultTab = 'invoice'
    const [activeTabId, setActiveTabId] = useState(defaultTab)

    return (
        <div className="box-operation">
            <div className='box-operation__tabs tabs'>
                <TabHeader defaultTab={defaultTab} onTabClick={setActiveTabId} />
                <TabContent activeTabId={activeTabId} />
            </div>
        </div>
    )
}

export default Widget