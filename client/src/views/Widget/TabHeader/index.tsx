import React, { useState } from 'react'


interface TabHeaderProps {
    defaultTab: string
    onTabClick: (tabId: string) => void
}

const TabHeader: React.FC<TabHeaderProps> = ({ onTabClick, defaultTab }) => {
    const [currentTabId, setCurrentTabId] = useState(defaultTab)

    const handleTabClick = (e: React.MouseEvent<HTMLLIElement>) => {
        const id = e.currentTarget.getAttribute('data-tab-id') ?? defaultTab
        setCurrentTabId(id)
        onTabClick(id)
    }

    return (
        <ul className="tab-nav" data-tabs-nav="">
            <li onClick={handleTabClick} aria-label='swap' data-tab-id="swap" className={currentTabId === 'swap' ? 'is_active' : ''} ><span>Swap</span></li>
            <li onClick={handleTabClick} aria-label='operate' data-tab-id="operate" className={currentTabId === 'operate' ? 'is_active' : ''} ><span>Operate</span></li>
        </ul>
    )
}

export default TabHeader