import React from "react";

interface ActionButtonProps {
  text: string;
  className?: string;
  type?: "primary" | "secondary" | "loading";
  disabled?: boolean;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const {
    text,
    className = "",
    type = "primary",
    disabled = false,
    onClick = () => null,
  } = props;
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className={`btn btn--full btn--${type}`}
        disabled={type === "loading" || disabled}
      >
        <span>{text}</span>
        {type === "loading" && <i className="icon icon-loader"></i>}
      </button>
    </div>
  );
};

export default ActionButton;
