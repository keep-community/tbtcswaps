import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Input from ".";

test("snapshot of component rendered with no label", () => {
  const component = render(<Input />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with label", () => {
  const component = render(<Input label="Test" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with hint", () => {
  const component = render(<Input label="Test" hint={<span>Hint</span>} />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with actionText", () => {
  const component = render(<Input label="Test" actionText="MAX" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered with svgIcon", () => {
  const component = render(
    <Input
      label="Test"
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
