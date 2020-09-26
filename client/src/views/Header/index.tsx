import React from 'react'
/* import styles from './styles.module.css' */
import UserAddress from "../UserAddress/UserAddress";
import { Web3Provider } from "../../ethereum";
import LOGO from '../../img/logo.svg'
import ICON_GEAR from '../../img/icons.svg'


const Header: React.FC<{ web3: Web3Provider }> = ({ web3 }) => {
    return (
        <header className={'header'}>
            <div className={'container'}>
                <div className={`${'header__row'} ${'row'} ${'justify-between'}`} >
                    <div className={'header__left'}>
                        <a href="/" className={'logo'}>
                            <img className={'logo__img'} src={LOGO} width="111" height="66" alt="" />
                        </a>
                    </div>
                    <div className={'header__right row'}>
                        <UserAddress web3={web3} />
                        <div className="header__settings settings">
                            <button className="settings__button">
                                <svg className="icon icon-gear">
                                    <use xlinkHref={`${ICON_GEAR}#icon-gear`}></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header