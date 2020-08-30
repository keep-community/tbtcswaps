import React from "react";
import TextField from "@material-ui/core/TextField";
import lnLogo from "./lightning.png";
import tbtcLogo from "./tBTC.png";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Web3Provider} from '../../ethereum'

export default function BasicTextFields(props:{web3:Web3Provider}) {
    return props.web3===null?<></>:
    <Grid container spacing={3}>
    </Grid>
}