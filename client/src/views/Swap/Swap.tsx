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
import { Web3Provider, Operator, Ln2tbtcContract } from "../../ethereum";
import Web3 from "web3";
import ln2tbtcABI from "../../contracts/LN2tBTC.json";
import type { AbiItem } from "web3-utils";
import { ln2tbtcAddress } from "../../contracts/deployedAddresses";
import Invoice from "./Invoice";
import "./Swap.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        //width: '25ch',
      },
    },
    switchIcon: {
      height: "100%",
    },
    wideTextField: {
      width: "100%",
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

async function getOperators(): Promise<Operator[]> {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4"
    )
  );
  const contract = new web3.eth.Contract(
    ln2tbtcABI.abi as AbiItem[],
    ln2tbtcAddress
  ) as Ln2tbtcContract;
  const length = Number(await contract.methods.getOperatorListLength().call());
  const indexArray = Array.from(Array(length), (_, i) => i);
  const operators = await Promise.all(
    indexArray.map((index) =>
      contract.methods
        .operatorList(index)
        .call()
        .then((operatorAddress) =>
          contract.methods.operators(operatorAddress).call()
        )
    )
  );
  return operators;
}

function removeFees(amount: number, linearFee: number, constantFee: number) {
  return ((amount * 10 ** 8 - constantFee) * 10 ** 8) / (10 ** 8 + linearFee);
}

function calculateLowestSwap(
  operators: Operator[],
  fromAmount: number,
  fromLN: boolean
) {
  console.log(fromAmount);
  const selectedOps = operators
    .map((op) => {
      const totalProvided = removeFees(
        fromAmount,
        Number(op.linearFee),
        Number(op.constantFee)
      );
      console.log(totalProvided);
      return {
        ...op,
        totalProvided,
      };
    })
    .filter((op) => {
      const opBalance = fromLN ? op.tBTCBalance : op.lnBalance;
      return Number(opBalance) > op.totalProvided && op.totalProvided > 0;
    })
    .sort((a, b) => b.totalProvided - a.totalProvided); // From highest to lowest
  if (selectedOps.length === 0) {
    return undefined;
  } else {
    return selectedOps[0];
  }
}

export default function Swap(props: { web3: Web3Provider }) {
  const classes = useStyles();
  const [fromLN, setFromLN] = React.useState(false);
  const [stage, setStage] = React.useState<"initial" | "invoice">("initial");
  const [fromAmount, setFromAmount] = React.useState<number | null>(null);
  const [operators, setOperators] = React.useState<Operator[] | null>(null);
  if (operators === null) {
    getOperators().then(setOperators);
  }
  let selectedOperator: ReturnType<typeof calculateLowestSwap> | undefined;
  let error = false;
  if (fromAmount === null || fromAmount === 0 || operators === null) {
    selectedOperator = undefined;
  } else {
    selectedOperator = calculateLowestSwap(operators, fromAmount, fromLN);
    if (selectedOperator === undefined) {
      error = true;
    }
  }
  if (stage === "initial") {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                label="From"
                {...sharedInputProps}
                className={classes.wideTextField}
                error={error}
                helperText={
                  error
                    ? "No operator provides enough liquidity to swap this much"
                    : undefined
                }
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
                        alt="coin logo"
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="To"
                {...sharedInputProps}
                className={classes.wideTextField}
                value={
                  selectedOperator === undefined
                    ? ""
                    : selectedOperator.totalProvided / 10 ** 8
                }
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <img
                        src={fromLN ? tbtcLogo : lnLogo}
                        height={getLogoSize(!fromLN)}
                        alt="coin logo"
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
            <IconButton
              aria-label="switch"
              onClick={() => setFromLN(!fromLN)}
              className={classes.switchIcon}
            >
              <SwapVertIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
        {props.web3 === null ? undefined : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={error}
            onClick={() => {
              if (error === false) {
                setStage("invoice");
              }
            }}
          >
            Swap
          </Button>
        )}
      </>
    );
  } else if (stage === "invoice" && props.web3 !== null) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Invoice
            web3={props.web3}
            operatorAddress={"0xCD8dD5596b8c83A6a98C9A8Cf33d2565d4c43A9A"}
            tBTCAmount={String(fromAmount! * 10 ** 8)}
          />
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
}
