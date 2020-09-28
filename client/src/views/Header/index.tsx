import React from "react";
import UserAddress from "../UserAddress";
import LOGO from "../../img/logo.svg";

const Header: React.FC = () => {
  return (
    <header className={"header header--short"}>
      <div className={"container"}>
        <div className={`${"header__row"} ${"row"} ${"justify-between"}`}>
          <div className={"header__left"}>
            <a href="/" className={"logo"}>
              <img
                className={"logo__img"}
                src={LOGO}
                width="111"
                height="66"
                alt=""
              />
            </a>
          </div>
          <div className={"header__right row"}>
            <UserAddress />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
