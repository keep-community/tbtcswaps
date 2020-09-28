import React from "react";
import { render } from "@testing-library/react";
import ContentBlock from ".";

test("snapshot of component rendered with no label", () => {
  const component = render(
    <ContentBlock>
      <span>Test</span>
    </ContentBlock>
  );
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with label", () => {
  const component = render(
    <ContentBlock label="test">
      <span>Test</span>
    </ContentBlock>
  );
  expect(component.baseElement).toMatchSnapshot();
});
