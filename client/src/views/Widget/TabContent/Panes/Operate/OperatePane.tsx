import React, { useState, useEffect } from "react";
import ICONS from "../../../../../img/icons.svg";
import ActionButton from "../../../common/ActionButton";
import Input from "../../../common/Input";
import Notification from "../../../common/Notification";
import { toMaxDecimalsRound } from "../../../utils";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null } = props;

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    const name = ev.target.name;
    let value = ev.target.value;
    if (ev.target.type === "number")
      value =
        ev.target.value === ""
          ? ev.target.value
          : toMaxDecimalsRound(ev.target.value, +ev.target.step).toString();

    setFormValues((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    handleInputChange(formValues);
  }, [formValues, handleInputChange]);

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__operate operate">
            <div className="operate__form">
              <Notification>
                <span>Add liquidity and earn fees on user swaps. <a href="/">Learn more</a>.</span>
              </Notification>
              <div className="form-group">
                <Input
                  value={formValues["lnBalance"]}
                  onChange={onChange}
                  name="lnBalance"
                  label="LN Balance "
                  svgIcon={
                    <svg className="icon icon-flash">
                      <use xlinkHref={`${ICONS}#icon-flash`}></use>
                    </svg>
                  }
                  placeholder="0.0"
                  type="number"
                />
              </div>
              <div className="form-group">
                <Input
                  value={formValues["tbtcBalance"]}
                  onChange={onChange}
                  name="tbtcBalance"
                  label="tBTC Balance "
                  svgIcon={
                    <svg className="icon icon-man">
                      <use xlinkHref={`${ICONS}#icon-man`}></use>
                    </svg>
                  }
                  placeholder="0.0"
                  type="number"
                />
              </div>
              <div className="form-group">
                <Input
                  value={formValues["linearFee"]}
                  onChange={onChange}
                  name="linearFee"
                  label="Linear Fee "
                  placeholder="0.0"
                  type="number"
                  hint={
                    <>
                      <b>Linear Fee</b> is a format for a Lightning Network
                      invoice uses a bech32 encoding, which is also used for
                      Bitcoin’s Segregated Witness. <br />
                      <a href="/">Learn more</a>
                    </>
                  }
                />
              </div>
              <div className="form-group">
                <Input
                  value={formValues["constantFee"]}
                  onChange={onChange}
                  name="constantFee"
                  label="Constant Fee "
                  placeholder="0.0"
                  type="number"
                  hint={
                    <>
                      <b>Linear Fee</b> is a format for a Lightning Network
                      invoice uses a bech32 encoding, which is also used for
                      Bitcoin’s Segregated Witness. <br />
                      <a href="/">Learn more</a>
                    </>
                  }
                />
              </div>
              <div className="form-group">
                <Input
                  value={formValues["nodeAddress"]}
                  onChange={onChange}
                  name="nodeAddress"
                  label="Node Address "
                  placeholder="0.0"
                  type="number"
                  hint={
                    <>
                      <b>Linear Fee</b> is a format for a Lightning Network
                      invoice uses a bech32 encoding, which is also used for
                      Bitcoin’s Segregated Witness. <br />
                      <a href="/">Learn more</a>
                    </>
                  }
                />
              </div>
              <ActionButton text="Register" className="operate__button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatePane;
