import React from "react";

interface modalDataType {
  title: string;
  buttonText: string;
  content: any;
}

const modalData: { [key: string]: modalDataType } = {
  about: {
    title: "About",
    buttonText: "Got it!",
    content: (
      <>
        tbtcswaps is a decentralized service that enables trustless swaps between tBTC and BTC on the lightning network.
        <br />
        <br />
        It is based on a protocol derived from submarine swaps and it's served by a network of liquidity providers that anyone can join.
        <br />
        <br />
        If you'd like to learn more about how everything works check out our{" "}
        <a href="https://github.com/corollari/tbtcswaps/blob/master/README.md">
          our docs
        </a>
        .
      </>
    ),
  },
  "contact-us": {
    title: "Contact us",
    buttonText: "Got it!",
    content: (
      <p>
        Just drop a message on Keep's discord tagging me{" "}
        <strong>@corollari#2127</strong> or <strong>@bakarapara#3452</strong>.
        Otherwise you can send an email to{" "}
        <a href="mailto:hello@tbtcswaps.com">hello@tbtcswaps.com</a>.
      </p>
    ),
  },
};

export default modalData;
