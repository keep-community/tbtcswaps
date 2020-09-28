import React from "react";
import { render } from "@testing-library/react";
import Footer from ".";

test("snapshot of component rendered without web3", () => {
  const component = render(<Footer />);
  expect(component.baseElement).toMatchSnapshot();
});
