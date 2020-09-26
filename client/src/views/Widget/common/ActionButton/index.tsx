import React from 'react'

const ActionButton: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
    return (
        <div className={className}>
            <button type="submit" className="btn btn--full">{text}</button>
        </div>
    )
}

export default ActionButton