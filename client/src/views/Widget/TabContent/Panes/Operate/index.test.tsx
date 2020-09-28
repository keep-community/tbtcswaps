import React from "react";
import { render } from "@testing-library/react";
import OperatePane from ".";

test("snapshot of component rendered", () => {
  const component = render(<OperatePane />);
  expect(component.baseElement).toMatchSnapshot();
});
