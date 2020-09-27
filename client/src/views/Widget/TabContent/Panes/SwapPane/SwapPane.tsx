import React, { useState, useEffect } from 'react'
import ICONS from '../../../../../img/icons.svg'
import ActionButton from '../../../common/ActionButton'
import Input from '../../../common/Input'
import { toMaxDecimalsRound } from '../../../utils'

interface SwapPaneProps {
    handleInputChange?: (name: string, value: number) => void
    onConnectWalletClick?: () => void
    onSwapClick?: () => void
    isConnected?: boolean
    handleFromDenomChange?: (denom: string) => void
}

const SwapPane: React.FC<SwapPaneProps> = (props) => {
    const { handleInputChange = () => null, onConnectWalletClick = () => null, onSwapClick = () => null, isConnected = false, handleFromDenomChange = () => null } = props

    const [leftInputDenom, setLeftInputDenom] = useState('tbtc')
    useEffect(() => {
        handleFromDenomChange(leftInputDenom)
    }, [leftInputDenom, handleFromDenomChange])

    const [tbtcAmount, setTbtcAmount] = useState<string>('')
    const [lnAmount, setLnAmount] = useState<string>('')

    const tbtcInputProps = {
        svgIcon: <svg className="icon icon-man" ><use xlinkHref={`${ICONS}#icon-man`}></use></svg>,
        placeholder: "0.0",
        type: "number",
        value: tbtcAmount,
        name: 'tbtc',
        step: 0.001,
        min: 0,
    }
    const lnInputProps = {
        svgIcon: <svg className="icon icon-flash"><use xlinkHref={`${ICONS}#icon-flash`}></use></svg>,
        placeholder: "0.0",
        type: "number",
        value: lnAmount,
        name: 'ln',
        step: 0.001,
        min: 0,
    }


    const onInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        //setXAmount is the amount displayed in the input, should be string
        const name = ev.target.name
        const value = ev.target.value === '' ? ev.target.value : ev.target.type === 'number' ? toMaxDecimalsRound(ev.target.value, +ev.target.step).toString() : ev.target.value
        if (name === 'tbtc')
            setTbtcAmount(value)
        else if (name === 'ln')
            setLnAmount(value)

        //this will be sent to parent's component, conversion to number type
        handleInputChange(name, +value)
    }

    return (
        <div className="tab-pane is_active">
            <div className="tab-pane__content">
                <div className="box-operation__content">
                    <div className="box-operation__exchange exchange">
                        <div className="exchange__form" >
                            <div className="exchange__row row align-end">
                                <Input
                                    label="From"
                                    actionText="MAX"
                                    className="exchange__column--from"
                                    onInput={onInput}
                                    {...(leftInputDenom === 'tbtc' ? tbtcInputProps : lnInputProps)}
                                />
                                <div className="exchange__column exchange__column--icon">
                                    <div className="exchange__icon">
                                        <svg
                                            onClick={() => {
                                                setLeftInputDenom(old => {
                                                    if (old === 'ln') return 'tbtc'
                                                    else return 'ln'
                                                })
                                            }}
                                            className="icon icon-direction"
                                        >
                                            <use xlinkHref={`${ICONS}#icon-direction`}></use>
                                        </svg>
                                    </div>
                                </div>
                                <Input
                                    label="To"
                                    className="exchange__column--to"
                                    onInput={onInput}
                                    {...(leftInputDenom === 'tbtc' ? lnInputProps : tbtcInputProps)}
                                />
                            </div>
                            {
                                isConnected ?
                                    <ActionButton onClick={onSwapClick} text="Swap" className="exchange__button" />
                                    : <ActionButton onClick={onConnectWalletClick} text="Connect wallet" type='secondary' className="exchange__button" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwapPane