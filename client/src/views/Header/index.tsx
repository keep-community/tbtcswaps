import React, {useContext} from 'react'
import UserAddress from "../UserAddress/UserAddress";
import LOGO from '../../img/logo.svg'
import ICONS from '../../img/icons.svg'

const Header: React.FC = () => {

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
                        <UserAddress />
                        <div className="header__settings settings">
                            <button className="settings__button">
                                <svg className="icon icon-gear">
                                    <use xlinkHref={`${ICONS}#icon-gear`}></use>
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