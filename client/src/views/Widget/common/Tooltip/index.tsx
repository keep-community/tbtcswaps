import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import ICONS from "../../../../img/icons.svg";

interface HintProps {
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  svgIcon?: React.ReactNode;
}

const Hint = React.forwardRef<HTMLSpanElement, HintProps>((props, ref) => (
  <span
    ref={ref}
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
    className={props.svgIcon ? "tooltip-general" : "tooltip-help"}
  >
    {props.svgIcon || (
      <svg className="icon icon-question">
        <use xlinkHref={`${ICONS}#icon-question`}></use>
      </svg>
    )}
  </span>
));

const calculateTooltipPosition = (
  el: HTMLElement,
  tooltipWidth: number,
  tooltipHeight: number
) => {
  const rect = el.getBoundingClientRect();
  const top = window.pageYOffset || document.documentElement.scrollTop,
    left = window.pageXOffset || document.documentElement.scrollLeft;

  let arrowOffset = tooltipWidth / 2;

  const screenHeight =
    window.innerHeight ||
    document.body.clientHeight ||
    document.documentElement.clientHeight;

  let position = "bottom";
  let x = rect.top + top + rect.height + 6;
  let y = rect.left + left + -tooltipWidth / 2 + rect.width / 2;

  const elPosX = rect.left + rect.width / 2;
  if (elPosX <= tooltipWidth / 2) {
    y += tooltipWidth / 2 - elPosX;
    arrowOffset -= tooltipWidth / 2 - elPosX;
  }

  const elPosY = rect.top + rect.height / 2;
  if (screenHeight - elPosY <= tooltipHeight) {
    position = "top";
    x = x - tooltipHeight - rect.height - 12;
  }

  return {
    x,
    y,
    position,
    arrowOffset,
  };
};

const Tooltip: React.FC<{
  hintButton: React.RefObject<HTMLSpanElement>;
  onDismiss: () => void;
  active: boolean;
}> = ({ hintButton, onDismiss, children, active }) => {
  const [tooltipRect, setTooltipRect] = useState({
    position: "0",
    x: -1000,
    y: -1000,
    arrowOffset: 0,
  });
  const width = 340;
  const height = 400;
  let myself = useRef<HTMLDivElement>(null);

  const myselfComplexCheck = myself.current ? myself.current.clientHeight : 0;

  useLayoutEffect(() => {
    const getTooltipRect = (height: number) => {
      if (hintButton && hintButton.current !== null) {
        const xy = calculateTooltipPosition(hintButton.current, width, height);
        setTooltipRect(xy);
      }
    };

    if (myself !== null && myself.current !== null) {
      const height = myself.current.clientHeight;
      getTooltipRect(height);
    }
  }, [myselfComplexCheck, hintButton]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (myself.current && !myself.current.contains(event.target as Node)) {
        onDismiss();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [myself, onDismiss]);

  return (
    <div
      ref={myself}
      className={`tooltipster-base tooltipster-sidetip tooltipster-${
        tooltipRect.position
      } fff tooltipster-fade ${
        active ? "tooltipster-show" : "tooltipster-dying"
      }`}
      style={{
        position: "absolute",
        maxWidth: `${!active ? "0" : width}px`,
        maxHeight: `${!active ? "0" : height}px`,
        zIndex: 9999999,
        top: `${!active ? "0" : tooltipRect.x}px`,
        left: `${!active ? "0" : tooltipRect.y}px`,
        /* height: '122px', */
        /* width: `${width}px`, */
        animationDuration: "350ms",
        transitionDuration: "350ms",
      }}
    >
      <div className="tooltipster-box">
        <div className="tooltipster-content">{children}</div>
      </div>
      <div
        className="tooltipster-arrow"
        style={{ left: `${tooltipRect.arrowOffset}px` }}
      >
        <div className="tooltipster-arrow-uncropped">
          <div className="tooltipster-arrow-border"></div>
          <div className="tooltipster-arrow-background"></div>
        </div>
      </div>
    </div>
  );
};

export { Hint, Tooltip };
