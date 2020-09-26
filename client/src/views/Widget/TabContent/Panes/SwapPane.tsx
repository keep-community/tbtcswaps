import React from 'react'
import ICONS from '../../../../img/icons.svg'
import ActionButton from '../../common/ActionButton'
import Input from '../../common/Input'

const SwapPane: React.FC = () => {


    return (
        <div className="tab-pane is_active">
            <div className="tab-pane__content">
                <div className="box-operation__content">
                    <div className="box-operation__exchange exchange">
                        <form action="#" className="exchange__form">
                            <div className="exchange__row row align-end">
                                <Input
                                    label="From"
                                    svgIcon={
                                        <svg className="icon icon-man">
                                            <use xlinkHref={`${ICONS}#icon-man`}></use>
                                        </svg>
                                    }
                                    actionText="MAX"
                                    placeholder="0.0"
                                    type="text"
                                    value="0.9"
                                    className="exchange__column--from"
                                />
                                <div className="exchange__column exchange__column--icon">
                                    <div className="exchange__icon">
                                        <svg className="icon icon-direction">
                                            <use xlinkHref={`${ICONS}#icon-direction`}></use>
                                        </svg>
                                    </div>
                                </div>
                                <Input
                                    label="To"
                                    svgIcon={
                                        <svg className="icon icon-flash">
                                            <use xlinkHref={`${ICONS}#icon-flash`}></use>
                                        </svg>
                                    }
                                    placeholder="0.0"
                                    type="text"
                                    className="exchange__column--to"
                                />
                            </div>
                            <ActionButton text="Swap" className="exchange__button" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwapPane