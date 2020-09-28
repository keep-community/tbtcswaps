import React from "react";

interface modalDataType {
  title: string;
  buttonText: string;
  content: any;
}

const modalData: { [key: string]: modalDataType } = {
  code: {
    title: "Code",
    buttonText: "Got it!",
    content: <>Github!</>,
  },
  docs: {
    title: "Docs",
    buttonText: "Got it!",
    content: (
      <>
        <p>
          LN2tBTC is a decentralized service that enables trustless swaps
          between tBTC and BTC on the lightning network.
        </p>
        <p>
          It is based on a protocol derived from submarine swaps and it's served
          by a network of liquidity providers that anyone can join.
        </p>
        <p>
          If you'd like to learn more about how everything works check out our
          our docs.
        </p>
        <p>
          <a href="/">Learn more in this Medium artcile</a>
        </p>
      </>
    ),
  },
  about: {
    title: "About",
    buttonText: "Got it!",
    content: (
      <>
        LN2tBTC is a decentralized service that enables trustless swaps between
        tBTC and BTC on the lightning network.
        <br />
        <br />
        It is based on a protocol derived from submarine swaps and it's served
        by a network of liquidity providers that anyone can join.
        <br />
        <br />
        If you'd like to learn more about how everything works check out our{" "}
        <a href="https://github.com/corollari/ln2tBTC/blob/master/README.md">
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
        <strong>@corollari#2127</strong> or send me an email at{" "}
        <a href="mailto:admin@ln2tbtc.com">admin@ln2tbtc.com</a>.
      </p>
    ),
  },
};

export default modalData;
