import React from "react";
import { render, screen } from "@testing-library/react";
import ActionButton from ".";

test("snapshot of button with default attributes", () => {
  const component = render(<ActionButton text="Test" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of button disabled", () => {
  const component = render(<ActionButton text="Test" disabled />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of button type primary", () => {
  const component = render(<ActionButton text="Test" type="primary" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of button type secondary", () => {
  const component = render(<ActionButton text="Test" type="secondary" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of button type loading", () => {
  const component = render(<ActionButton text="Test" type="loading" />);
  expect(component.baseElement).toMatchSnapshot();
});

test("click event default type button", () => {
  const mockCallBack = jest.fn();

  const component = render(<ActionButton text="Test" onClick={mockCallBack} />);
  const button = screen.getByText("Test").closest("button");
  if (button) button.click();
  expect(mockCallBack.mock.calls.length).toEqual(1);
});

test("click event primary type button", () => {
  const mockCallBack = jest.fn();

  const component = render(
    <ActionButton text="Test" onClick={mockCallBack} type="primary" />
  );
  const button = screen.getByText("Test").closest("button");
  if (button) button.click();
  expect(mockCallBack.mock.calls.length).toEqual(1);
});

test("click event secondary type button", () => {
  const mockCallBack = jest.fn();

  const component = render(
    <ActionButton text="Test" onClick={mockCallBack} type="secondary" />
  );
  const button = screen.getByText("Test").closest("button");
  if (button) button.click();
  expect(mockCallBack.mock.calls.length).toEqual(1);
});

test("click event disabled type button", () => {
  const mockCallBack = jest.fn();

  const component = render(
    <ActionButton text="Test" onClick={mockCallBack} disabled />
  );
  const button = screen.getByText("Test").closest("button");
  if (button) button.click();
  expect(mockCallBack.mock.calls.length).toEqual(0);
});

test("click event loading type button", () => {
  const mockCallBack = jest.fn();

  const component = render(
    <ActionButton text="Test" onClick={mockCallBack} disabled />
  );
  const button = screen.getByText("Test").closest("button");
  if (button) button.click();
  expect(mockCallBack.mock.calls.length).toEqual(0);
});
