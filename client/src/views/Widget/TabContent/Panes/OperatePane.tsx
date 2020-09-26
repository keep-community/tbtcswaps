import React from 'react'
import ICONS from '../../../../img/icons.svg'
import ActionButton from '../../common/ActionButton'
import Input from '../../common/Input'
import Notification from '../../common/Notification'

const OperatePane: React.FC = () => {


    return (
        <div className="tab-pane is_active">
            <div className="tab-pane__content">
                <div className="box-operation__content">
                    <div className="box-operation__operate operate">
                        <form action="#" className="operate__form">
                            <Notification>
                                Add liquidity and earn fees on user swaps. <a href="/">Learn more</a>
                            </Notification>
                            <div className="form-group">
                                <Input
                                    label="LN Balance "
                                    svgIcon={
                                        <svg className="icon icon-flash">
                                            <use xlinkHref={`${ICONS}#icon-flash`}></use>
                                        </svg>
                                    }
                                    placeholder="0.0"
                                    type="text"
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    label="tBTC Balance "
                                    svgIcon={
                                        <svg className="icon icon-man">
                                            <use xlinkHref={`${ICONS}#icon-man`}></use>
                                        </svg>
                                    }
                                    placeholder="0.0"
                                    type="text"
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    label="Linear Fee "
                                    placeholder="0.0"
                                    type="text"
                                    hint={(
                                        <>
                                            <b>Linear Fee</b> is a format for a Lightning Network invoice uses a bech32 encoding, which is also used for Bitcoin’s Segregated Witness. <br />
                                            <a href="/">Learn more</a>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    label="Constant Fee "
                                    placeholder="0.0"
                                    type="text"
                                    hint={(
                                        <>
                                            <b>Linear Fee</b> is a format for a Lightning Network invoice uses a bech32 encoding, which is also used for Bitcoin’s Segregated Witness. <br />
                                            <a href="/">Learn more</a>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    label="Node Address "
                                    placeholder="0.0"
                                    type="text"
                                    hint={(
                                        <>
                                            <b>Linear Fee</b> is a format for a Lightning Network invoice uses a bech32 encoding, which is also used for Bitcoin’s Segregated Witness. <br />
                                            <a href="/">Learn more</a>
                                        </>
                                    )}
                                />
                            </div>
                            <ActionButton text="Register" className="operate__button" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OperatePane