import React from "react";
import { render } from "@testing-library/react";
import SwapPane from ".";

test("snapshot of component rendered", () => {
  const component = render(<SwapPane />);
  expect(component.baseElement).toMatchSnapshot();
});