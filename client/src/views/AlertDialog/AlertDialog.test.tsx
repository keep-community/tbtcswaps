import AlertDialog from "./AlertDialog";
import React from "react";
import { render } from "@testing-library/react";

function renderDialog(open: boolean) {
  return render(
    <AlertDialog open={open} title="SumTitle" handleClose={() => {}}>
      <></>
    </AlertDialog>
  );
}

test("dialog is not displayed when closed but it is when open", () => {
  const closedDialog = renderDialog(false).getByText(/SumTitle/i);
  expect(closedDialog).toBeInTheDocument();
  const openDialog = renderDialog(true).getAllByText(/SumTitle/i)[0];
  expect(openDialog).toBeInTheDocument();
});
