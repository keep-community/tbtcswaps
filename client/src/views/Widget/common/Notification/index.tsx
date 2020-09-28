import React from "react";

const Notification: React.FC<{ className?: string }> = (props) => {
  const { children, className = "" } = props;
  return (
    <div className={`notification ${className}`}>
      <div className="notification__text">{children}</div>
    </div>
  );
};

export default Notification;
