import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import "./Footer.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialog() {
  const [dialog, setDialog] = React.useState<"about" | "contact" | null>(null);

  const handleClose = () => {
    setDialog(null);
  };

  return (
    <footer>
      <a href="https://github.com/corollari/ln2tBTC">Code</a>&nbsp;·&nbsp;
      <a href="https://github.com/corollari/ln2tBTC/blob/master/README.md">
        Docs
      </a>
      &nbsp;·&nbsp;
      <a onClick={() => setDialog("about")} href="#">
        About
      </a>
      &nbsp;·&nbsp;
      <a onClick={() => setDialog("contact")} href="#">
        Contact us
      </a>
      <Dialog
        open={dialog !== null}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialog === "about" ? "About" : "Contact us"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog === "about" ? (
              <>
                LN2tBTC is a decentralized service that enables trustless swaps
                between tBTC and BTC on the lightning network.
                <br />
                <br />
                It is based on a protocol derived from submarine swaps and it's
                served by a network of liquidity providers that anyone can join.
                <br />
                <br />
                If you'd like to learn more about how everything works check out
                our{" "}
                <a href="https://github.com/corollari/ln2tBTC/blob/master/README.md">
                  our docs
                </a>
                .
              </>
            ) : (
              <>
                Just drop a message on{" "}
                <a href="https://discord.com/channels/590951101600235531/681226760209432608/748490345217654786">
                  Keep's discord
                </a>{" "}
                tagging me (@corollari#2127) or send me an email at
                admin@ln2tbtc.com
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </footer>
  );
}
/*
export default function(){
    return <footer><a href="https://github.com/corollari/ln2tBTC">Code</a> ·
    <a href="https://github.com/corollari/ln2tBTC/blob/master/README.md">Docs</a> ·
    <a>Chat</a></footer>
}
*/
