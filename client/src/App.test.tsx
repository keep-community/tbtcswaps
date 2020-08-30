import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders widget & footer", () => {
  const { getByText, getAllByText } = render(<App />);
  const footerElement = getByText(/About/i);
  expect(footerElement).toBeInTheDocument();
  const widgetElement = getAllByText(/Swap/i)[0];
  expect(widgetElement).toBeInTheDocument();
});
