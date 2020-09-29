import React, { useState, useEffect, useContext } from "react";
import ICONS from "../../../../../img/icons.svg";
import ActionButton from "../../../common/ActionButton";
import Input from "../../../common/Input";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { ERC20Contract } from "../../../../../ethereum";
import {addDecimalsToUint} from '../../../utils'

interface SwapPaneProps {
  handleInputChange?: (name: string, value: string) => void;
  onConnectWalletClick?: () => void;
  onSwapClick?: () => void;
  isConnected?: boolean;
  handleFromNameChange?: (denom: 'tbtc' | 'ln') => void;
  notEnoughLiquidityError: boolean;
  lnAmount:string,
  tbtcAmount:string,
  noInputProvided:boolean
}

function getMaxTbtcAmount(contract:ERC20Contract, userAddress:string){
  return contract.methods.balanceOf(userAddress).call().then(balance => addDecimalsToUint(balance, 18))
}

const SwapPane: React.FC<SwapPaneProps> = (props) => {
  const {
    handleInputChange = () => null,
    onConnectWalletClick = () => null,
    onSwapClick = () => null,
    isConnected = false,
    handleFromNameChange = () => null,
    lnAmount,
    tbtcAmount,
    noInputProvided,
    notEnoughLiquidityError
  } = props;

  const [leftInputDenom, setLeftInputDenom] = useState<'tbtc' | 'ln'>("tbtc");
  useEffect(() => {
    handleFromNameChange(leftInputDenom);
  }, [leftInputDenom, handleFromNameChange]);

  const { tbtcContract, userAddress } = useContext(Web3Context);

  const tbtcInputProps = {
    svgIcon: (
      <svg className="icon icon-man no-fill-transition">
        <use xlinkHref={`${ICONS}#icon-man`}></use>
      </svg>
    ),
    placeholder: "0.0",
    value: tbtcAmount,
    name: "tbtc",
  };
  const lnInputProps = {
    svgIcon: (
      <svg className="icon icon-flash no-fill-transition">
        <use xlinkHref={`${ICONS}#icon-flash`}></use>
      </svg>
    ),
    placeholder: "0.0",
    value: lnAmount,
    name: "ln",
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    const name = ev.target.name;
    const value =
      ev.target.value === ""
        ? ev.target.value
        : ev.target.type === "number"
          ? toMaxDecimalsRound(ev.target.value, +ev.target.step).toString()
          : ev.target.value;

    //this will be sent to parent's component, conversion to number type
    handleInputChange(name, value);
  };

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content box-operation__content--swap">
          <div className="box-operation__exchange exchange">
            <div className="exchange__form">
              <div className="exchange__row row align-end">
                <Input
                  label="From"
                  className="exchange__column--from"
                  onChange={onChange}
                  {...(leftInputDenom === "tbtc"
                    ? tbtcInputProps
                    : lnInputProps)}
                  {...(leftInputDenom==="tbtc" && userAddress!==null?{
                    actionText: "MAX",
                    onActionTextClick: ()=>getMaxTbtcAmount(tbtcContract, userAddress).then(amount=>handleInputChange('tbtc', amount))
                  }:{})}
                />
                <div className="exchange__column exchange__column--icon">
                  <div className="exchange__icon">
                    <svg
                      onClick={() => {
                        setLeftInputDenom((old) => {
                          if (old === "ln") return "tbtc";
                          else return "ln";
                        });
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
                  disabled={true}
                  {...(leftInputDenom === "tbtc"
                    ? lnInputProps
                    : tbtcInputProps)}
                />
              </div>
              {isConnected ? (
                <>
                  {notEnoughLiquidityError || noInputProvided?
                    <ActionButton
                      disabled={true}
                      text={notEnoughLiquidityError?"Not enough liquidity":"Input an amount"}
                      className="exchange__button"
                    />
                    :
                    <>
                      <ActionButton
                        onClick={onSwapClick}
                        text="Swap"
                        className="exchange__button"
                      />
                      {leftInputDenom === 'ln' &&
                        <div className="note--bottom">
                          Note: 1 ETH will be locked during the swap process.
                        </div>
                      }
                    </>
                  }
                </>
              ) : (
                  <ActionButton
                    onClick={onConnectWalletClick}
                    text="Connect wallet"
                    type="secondary"
                    className="exchange__button"
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPane;
