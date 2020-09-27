import React, { useState } from 'react'
import TabHeader from './TabHeader'
import TabContent from './TabContent'

interface WidgetProps {
}

const Widget: React.FC<WidgetProps> = () => {
    const defaultTab = 'swap'
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