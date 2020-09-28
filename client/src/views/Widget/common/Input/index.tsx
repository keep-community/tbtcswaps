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
    error?: string
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
    step?: number
    min?: number
}

const Input: React.FC<InputProps> = (props) => {
    const { label, actionText, svgIcon, placeholder, value, type, className, hint, error, onChange, name } = props
    let questionMarkElement = useRef<HTMLSpanElement>(null);
    const [displayTooltip, setDisplayTooltip] = useState(false)

    return (
        <>
            <div className={`exchange__column ${className ?? ''}`}>
                <div className={`form-block ${error ? 'is_error' : ''}`}>
                    {label &&
                        <label className="form-block__label">
                            <span>
                                {label}
                            </span>
                            {hint &&
                                <Hint ref={questionMarkElement} onClick={() => {
                                    setDisplayTooltip(true)
                                }} />
                            }
                        </label>
                    }
                    <div className="form-block__box">
                        <input aria-label="input" step={props.step} min={props.min} name={name} onChange={onChange} type={type} className="form-block__input form-control" value={value} placeholder={placeholder} />
                        {actionText && <div className="form-block__unit">{actionText}</div>}
                        {svgIcon &&
                            <div className="form-block__icon">
                                {svgIcon}
                            </div>
                        }
                    </div>
                    {error &&
                        <div className="form-block__message">{error}</div>
                    }
                </div>
            </div>
            {
                <Tooltip active={displayTooltip} hintButton={questionMarkElement} onDismiss={() => setDisplayTooltip(false)} >
                    {hint}
                </Tooltip>
            }
        </>
    )
}


export default Input