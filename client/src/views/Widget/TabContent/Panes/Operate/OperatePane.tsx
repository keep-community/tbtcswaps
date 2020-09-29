import React, { useState, useEffect, useContext } from "react";
import ICONS from "../../../../../img/icons.svg";
import ActionButton from "../../../common/ActionButton";
import Input from "../../../common/Input";
import Notification from "../../../common/Notification";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import {
  Operator
} from "../../../../../ethereum";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean,
  registerOperator: (op: Operator) => Promise<void>
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected, registerOperator } = props;

  const { connectWallet } = useContext(Web3Context);

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
                <span>Add liquidity and earn fees on user swaps. <a href="https://github.com/corollari/tbtcswaps">Learn more</a>.</span>
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
                      <b>Linear Fee</b> is a percentual fee that will
                      be charged on all swaps and grows with the amount swapped.
                      <br />
                      The total fee is calculated as:
                      <br />
                      totalFee = amount*linearFee + constantFee
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
                      <b>Constant Fee</b> is a fee denominated in satoshis
                      that will be applied on all swaps by simply incrementing
                      the cost.
                      <br />
                      The total fee is calculated as:
                      <br />
                      totalFee = amount*linearFee + constantFee
                    </>
                  }
                />
              </div>
              <div className="form-group">
                <Input
                  value={formValues["nodeAddress"]}
                  onChange={onChange}
                  name="nodeAddress"
                  label="Public URL "
                  hint={
                    <>
                      <b>Public URL</b> should be the URL of your node
                      which should have a publicly-exposed HTTP interface.
                      <br />
                      SSL should be forced on all connections for security reasons.
                    </>
                  }
                />
              </div>
              {isConnected ?
                <ActionButton
                  text="Register"
                  className="operate__button"
                  onClick={() => {
                    registerOperator({
                      tBTCBalance: formValues.tbtcBalance,
                      lnBalance: formValues.lnBalance,
                      linearFee: formValues.linearFee,
                      constantFee: formValues.constantFee,
                      publicUrl: formValues.nodeAddress,
                      exists:true
                    })
                  }}
                />
                :
                <ActionButton text="Connect wallet" className="operate__button" type="secondary" onClick={connectWallet} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatePane;
