import React, { useRef, useState, useEffect } from "react";
import ICONS from "../../../../img/icons.svg";
import { Hint, Tooltip } from "../../common/Tooltip";
import QRCode from "qrcode";

interface TextQRProps {
  text: string;
  hint?: React.ReactNode;
}

const TextQR: React.FC<TextQRProps> = ({ text, hint }) => {
  let questionMarkElement = useRef<HTMLElement>(null);
  const [displayTooltip, setDisplayTooltip] = useState(false);

  const [QRUrl, setQRUrl] = useState<string>();

  useEffect(() => {
    const generateQr = async () => {
      const url = await QRCode.toDataURL(text);
      setQRUrl(url);
    };
    generateQr();
  }, [text]);

  return (
    <>
      <div className="invoice__block-text">{text}</div>
      <div className="invoice__block-code">
        <Hint
          ref={questionMarkElement}
          onClick={() => {
            setDisplayTooltip(true);
          }}
          svgIcon={
            <svg className="icon icon-code">
              <use xlinkHref={`${ICONS}#icon-code`}></use>
            </svg>
          }
        />
      </div>
      {
        <Tooltip
          active={displayTooltip}
          hintButton={questionMarkElement}
          onDismiss={() => setDisplayTooltip(false)}
        >
          {QRUrl ? (
            <img
              className="image-code"
              src={QRUrl}
              width="185"
              height="187"
              alt=""
            />
          ) : (
            <i
              style={{ textAlign: "center", width: "155px", height: "157px" }}
              className="image-code icon icon-loader"
            ></i>
          )}
        </Tooltip>
      }
    </>
  );
};

export default TextQR;
