import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Swap from "./Swap";

test("snapshot of initial state", () => {
  expect(render(<Swap />).baseElement).toMatchSnapshot();
});
