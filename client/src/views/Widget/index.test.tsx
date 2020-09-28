import React from "react";
import { render } from "@testing-library/react";
import Widget from ".";

test("snapshot of component rendered", () => {
  const component = render(<Widget />);
  expect(component.baseElement).toMatchSnapshot();
});
