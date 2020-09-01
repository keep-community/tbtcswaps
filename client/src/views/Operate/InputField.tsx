import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wideTextField: {
            width: "100%",
        },
    })
);

export default function InputField(props: { name: string, logo?: string, type?:string, onChange:(val:string)=>void }) {
    const classes = useStyles();
    return <Grid item xs={12}>
        <TextField
            label={props.name}
            type={props.type ?? "number"}
            variant="outlined"
            className={classes.wideTextField}
            onChange={(event)=>props.onChange(event.target.value)}
            inputProps={{
                step: 0.001,
                min: 0,
            }}
            InputProps={props.logo !== undefined ? {
                endAdornment: (
                    <InputAdornment position="end">
                        <img
                            src={props.logo}
                            height={20}
                            alt="coin logo"
                        />
                    </InputAdornment>
                ),
            } : undefined}
        />
    </Grid>
}