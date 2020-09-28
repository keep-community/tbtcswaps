import React from "react";
import { render } from "@testing-library/react";
import UserAddress from ".";

test("snapshot of component rendered when no address found", () => {
  const component = render(<UserAddress />);
  expect(component.baseElement).toMatchSnapshot();
});
