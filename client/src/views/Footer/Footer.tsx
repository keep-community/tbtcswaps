import React from "react";
import AlertDialog from "../AlertDialog/AlertDialog";
import "./Footer.css";

export default function Footer() {
  const [dialog, setDialog] = React.useState<"about" | "contact" | null>(null);

  const handleClose = () => {
    setDialog(null);
  };
  const a = <>a</>;
  return (
    <footer>
      <a href="https://github.com/corollari/ln2tBTC">Code</a>&nbsp;·&nbsp;
      <a href="https://github.com/corollari/ln2tBTC/blob/master/README.md">
        Docs
      </a>
      &nbsp;·&nbsp;
      <button
        type="button"
        className="link-button"
        onClick={() => setDialog("about")}
      >
        About
      </button>
      &nbsp;·&nbsp;
      <button
        type="button"
        className="link-button"
        onClick={() => setDialog("contact")}
      >
        Contact us
      </button>
      <AlertDialog
        title={dialog === "about" ? "About" : "Contact us"}
        open={dialog !== null}
        handleClose={handleClose}
      >
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
            If you'd like to learn more about how everything works check out our{" "}
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
      </AlertDialog>
    </footer>
  );
}
