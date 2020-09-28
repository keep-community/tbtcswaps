import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Footer from ".";

test("snapshot of component rendered without dialogs", () => {
  const component = render(<Footer />);
  expect(component.baseElement).toMatchSnapshot();
});

test("dialog opens when 'About' is clicked", async () => {
  render(<Footer />);
  fireEvent.click(screen.getByText("About"));
  /* await waitFor(() => screen.getByRole("presentation")); */
  expect(screen.getByRole("presentation")).toHaveTextContent(
    "LN2tBTC is a decentralized service"
  );
});

test("dialog opens when 'Contact us' is clicked", async () => {
  render(<Footer />);
  fireEvent.click(screen.getByText("Contact us"));
  /* await waitFor(() => screen.getByRole("presentation")); */
  expect(screen.getByRole("presentation")).toHaveTextContent("Contact us");
});

test("'Code' and 'Docs' is an anchor with href", async () => {
  render(<Footer />);
  expect(screen.getByText("Code").closest("a")).toHaveAttribute("href");
  expect(screen.getByText("Docs").closest("a")).toHaveAttribute("href");
});
