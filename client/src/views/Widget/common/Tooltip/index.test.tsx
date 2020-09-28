import React from "react";
import { render } from "@testing-library/react";
import { Tooltip, Hint } from ".";

test("snapshot of component rendered hint question mark (default)", () => {
  const component = render(<Hint />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered hint custom logo", () => {
  const component = render(
    <Hint
      svgIcon={
        <svg>
          <symbol id="icon-clock" viewBox="0 0 47 47">
            <circle
              cx="23.5"
              cy="23.5"
              r="22"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.5 9.5V23.5H37.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </svg>
      }
    />
  );
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of tooltip active", () => {
  const myRef = React.createRef<HTMLSpanElement>();
  const component = render(
    <Tooltip active={true} hintButton={myRef} onDismiss={() => null}>
      Hint
    </Tooltip>
  );
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of tooltip hidden", () => {
  const myRef = React.createRef<HTMLSpanElement>();
  const component = render(
    <Tooltip active={false} hintButton={myRef} onDismiss={() => null}>
      Hint
    </Tooltip>
  );
  expect(component.baseElement).toMatchSnapshot();
});
