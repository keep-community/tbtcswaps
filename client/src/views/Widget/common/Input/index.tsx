import React, { useRef, useState } from 'react'

import { Hint, Tooltip } from '../Tooltip'

interface InputProps {
    label?: string
    actionText?: string
    svgIcon?: React.ReactNode
    placeholder?: string
    value?: string
    type?: string
    display?: 'block' | 'inline'
    className?: string
    hint?: React.ReactNode
}

const Input: React.FC<InputProps> = ({ label, actionText, svgIcon, placeholder, value, type, className, hint }) => {

    let questionMarkElement = useRef<HTMLSpanElement>(null);
    const [displayTooltip, setDisplayTooltip] = useState(false)

    return (
        <>
            <div className={`exchange__column ${className ?? ''}`}>
                <div className="form-block form-block--icon">
                    {label &&
                        <label className="form-block__label">
                            <span>
                                {label}
                            </span>
                            {hint &&
                                <Hint ref={questionMarkElement} onClick={() => {
                                    console.log(questionMarkElement!.current!.getBoundingClientRect())
                                    setDisplayTooltip(true)
                                }} />
                            }
                        </label>
                    }
                    <div className="form-block__box">
                        <input type={type} className="form-block__input form-control" value={value} placeholder={placeholder} />
                        {actionText && <div className="form-block__unit">{actionText}</div>}
                        {svgIcon &&
                            <div className="form-block__icon">
                                {svgIcon}
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                displayTooltip && <Tooltip hintButton={questionMarkElement} onDismiss={() => setDisplayTooltip(false)} >
                    {hint}
                </Tooltip>
            }
        </>
    )
}


export default Input