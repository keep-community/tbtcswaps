import React from 'react'

const Notification: React.FC = ({ children }) => {
    return (
        <div className="notification">
            <div className="notification__text">
                {children}
            </div>
        </div>
    )
}

export default Notification