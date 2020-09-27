import React from 'react'
import { default as TextQR } from './TextQR'

interface ContentBlockProps {
    label?: string
}

const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    const { label, children } = props
    return (
        <div className="invoice__block invoice__block--invoice">
            {label && <div className="invoice__block-title">{label}</div>}
            <div className="invoice__block-content row">
                {children}
            </div>
        </div>
    )
}

export default ContentBlock
export { TextQR }