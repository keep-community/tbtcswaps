import React from 'react'

import { SwapPane, OperatePane, InvoicePane } from './Panes'


interface TabContentProps {
    activeTabId: string
}

const TabContent: React.FC<TabContentProps> = ({ activeTabId }) => {


    return (
        <div className="tab-content">
            {
                (activeTabId === 'swap' && <SwapPane />)
                || (activeTabId === 'operate' && <OperatePane />)
                || (activeTabId === 'invoice' && <InvoicePane />)
                || <div>Contact us.</div>
            }
        </div>
    )
}

export default TabContent