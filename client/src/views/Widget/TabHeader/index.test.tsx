import React from "react";
import { render } from "@testing-library/react";
import TabHeader from ".";

test("snapshot of component rendered with default tab second", () => {
  const component = render(
    <TabHeader onTabClick={() => null} defaultTab="swap" />
  );
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with default tab first", () => {
  const component = render(
    <TabHeader onTabClick={() => null} defaultTab="operate" />
  );
  expect(component.baseElement).toMatchSnapshot();
});
