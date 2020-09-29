import React from "react";
import Widget from "../Widget";

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
  return (
    <div className="wrapper-content">
      <div className="container">
        <div className="content">
          <div className="heading">
            <div className="heading__title">
              <h1>tBTC Swap Engine</h1>
            </div>
            <div className="heading__text">
              Trustless tBTC / Lightning Network swaps
            </div>
          </div>
          <Widget />
        </div>
      </div>
    </div>
  );
};

export default Body;
