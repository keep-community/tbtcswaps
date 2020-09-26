import React from 'react'
import ICONS from '../../../../img/icons.svg'
import { default as TextQR } from './TextQR'

interface ContentBlockProps {
    label: string
    className?: string
    type?: 'primary' | 'secondary' | 'loading'
    disabled?: boolean
}

const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    const { label, className = '', type = 'primary', disabled = false, children } = props
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