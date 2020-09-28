import React from "react";
import { render } from "@testing-library/react";
import Notification from ".";

test("snapshot of component rendered", () => {
  const component = render(
    <Notification>
      <span>Notify!</span>
    </Notification>
  );
  expect(component.baseElement).toMatchSnapshot();
});
