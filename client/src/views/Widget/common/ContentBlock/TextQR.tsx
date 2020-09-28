import React, { useRef, useState } from 'react'
import ICONS from '../../../../img/icons.svg'
import QR_DEMO from '../../../../img/qr.png'
import { Hint, Tooltip } from '../../common/Tooltip'

interface TextQRProps {
    text: string
    hint?: React.ReactNode
}

const TextQR: React.FC<TextQRProps> = ({ text, hint }) => {
    let questionMarkElement = useRef<HTMLElement>(null);
    const [displayTooltip, setDisplayTooltip] = useState(false)
    return (
        <>
            <div className="invoice__block-text">{text}</div>
            <div className="invoice__block-code">
                <Hint
                    ref={questionMarkElement}
                    onClick={() => { setDisplayTooltip(true) }}
                    svgIcon={
                        <svg className="icon icon-code">
                            <use xlinkHref={`${ICONS}#icon-code`}></use>
                        </svg>
                    } />
            </div>
            {
                <Tooltip active={displayTooltip} hintButton={questionMarkElement} onDismiss={() => setDisplayTooltip(false)} >
                    <img className="image-code" src={QR_DEMO} width="185" height="187" alt="" />
                </Tooltip>
            }
        </>
    )
}

export default TextQR