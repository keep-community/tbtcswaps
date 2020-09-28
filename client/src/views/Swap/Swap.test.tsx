import React from "react";
import { render } from "@testing-library/react";
import Swap from "./Swap";

test("snapshot of initial state", () => {
  expect(render(<Swap web3={null} />).baseElement).toMatchSnapshot();
});
