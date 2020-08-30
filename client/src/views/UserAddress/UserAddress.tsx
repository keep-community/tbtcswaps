import React from "react";
import {Web3Provider} from '../../ethereum'
import './UserAddress.css'

export default function BasicTextFields(props:{web3:Web3Provider}) {
    return <div className="top-right">{props.web3===null?'':(props.web3.currentProvider as any).selectedAddress}</div>
}