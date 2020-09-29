import React from "react";

import ICONS from "../../img/icons.svg";

interface ModalProps {
  isOpen: boolean;
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  type?: "normal" | "error" | "pending" | "success";
}

const iconsMap: { [key: string]: string } = {
  normal: "",
  error: "icon-bored",
  pending: "icon-clock",
  success: "icon-success",
};

const Modal: React.FC<ModalProps> = (props) => {
  const {
    isOpen,
    title,
    buttonText,
    children,
    onButtonClick,
    type = "normal",
  } = props;
  const icon = ICONS + "#" + iconsMap[type];

  return isOpen ? (
    <div role="presentation" className="blocker current">
      <div className="modal" style={{ display: "inline-block" }}>
        <div className="modal__content">
          <div className="modal__title">{title}</div>
          <div className={type === "normal" ? "" : "modal__row row"}>
            {type !== "normal" && (
              <div className="modal__icon">
                <svg className={`icon ${iconsMap[type]}`}>
                  <use xlinkHref={icon}></use>
                </svg>
              </div>
            )}
            <div className="modal__text">{children}</div>
          </div>
          <div className="modal__button row justify-end">
            <button onClick={onButtonClick} className="btn">
              {buttonText}
            </button>
          </div>
        </div>
        <a href="#close-modal" rel="modal:close" className="close-modal ">
          Close
        </a>
      </div>
    </div>
  ) : null;
};

export default Modal;
