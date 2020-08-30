import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import lnLogo from "./lightning.png";
import tbtcLogo from "./tBTC.png";
import InputAdornment from "@material-ui/core/InputAdornment";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Web3Provider} from '../../ethereum'
import "./Swap.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        //width: '25ch',
      },
    },
  })
);

function getLogoSize(ln: boolean) {
  return ln ? 20 : 30;
}

const sharedInputProps = {
  type: "number",
  variant: "outlined" as const,
  InputLabelProps: {
    shrink: true,
  },
};

export default function BasicTextFields(props:{web3:Web3Provider}) {
  const classes = useStyles();
  const [fromLN, setFromLN] = React.useState(true);
  const [fromAmount, setFromAmount] = React.useState<number | null>(null);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="From"
              {...sharedInputProps}
              onChange={(event) => setFromAmount(Number(event.target.value))}
              inputProps={{
                step: 0.001,
                min: 0,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={fromLN ? lnLogo : tbtcLogo}
                      height={getLogoSize(fromLN)}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="To"
              {...sharedInputProps}
              value={fromAmount === null ? undefined : fromAmount * 10}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={fromLN ? tbtcLogo : lnLogo}
                      height={getLogoSize(!fromLN)}
                    />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                step: 0.001,
                min: 0,
              }}
            />
          </form>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="delete" onClick={() => setFromLN(!fromLN)}>
            <SwapVertIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      {props.web3===null?undefined:<Button variant="contained" color="primary" size="large">
        Swap
      </Button>}
    </>
  );
}
