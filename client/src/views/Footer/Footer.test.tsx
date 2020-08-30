import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Footer from "./Footer";

test("snapshot of component rendered without dialogs", () => {
  const component = render(<Footer />);
  expect(component.baseElement).toMatchSnapshot();
});

test("dialog opens when 'About' is clicked", async () => {
  render(<Footer />);
  fireEvent.click(screen.getByText("About"));
  await waitFor(() => screen.getByRole("presentation"));
  expect(screen.getByRole("presentation")).toHaveTextContent(
    "LN2tBTC is a decentralized service"
  );
});
