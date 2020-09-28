import React from "react";
import { render } from "@testing-library/react";
import Modal from ".";

test("snapshot of component rendered open", () => {
  const component = render(
    <Modal
      isOpen={true}
      buttonText="Ok"
      title="Test"
      onButtonClick={() => null}
    >
      <span>Test description</span>
    </Modal>
  );
  expect(component.baseElement).toMatchSnapshot();
});

test("snapshot of component rendered closed", () => {
  const component = render(
    <Modal
      isOpen={false}
      buttonText="Ok"
      title="Test"
      onButtonClick={() => null}
    >
      <span>Test description</span>
    </Modal>
  );
  expect(component.baseElement).toMatchSnapshot();
});
