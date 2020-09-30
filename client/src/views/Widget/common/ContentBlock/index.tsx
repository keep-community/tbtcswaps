import React from "react";
import { default as TextQR } from "./TextQR";

interface ContentBlockProps {
  label?: string;
  error?: string
  onChange?: (text:string)=>void
}

const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { label, children, error, onChange } = props;
  return (
    <div className="invoice__block invoice__block--invoice">
      {label && <div className="invoice__block-title">{label}</div>}
      {!children ? (
        <>
          <textarea
            spellCheck="false"
            onChange={(event)=>onChange && onChange(event.target.value)}
            className={`invoice__block-content invoice__block-content--editable row ${error !== undefined ? 'is_error' : ''}`}
          />
          {error !== undefined && <span className="form-block__message invoice__block-error" >{error}</span>}
        </>
      ) : (
          <div className="invoice__block-content row">{children}</div>
        )}
    </div>
  );
};

export default ContentBlock;
export { TextQR };
