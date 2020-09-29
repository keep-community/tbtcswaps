import React, { useState } from "react";
import ActionButton from "../../../common/ActionButton";
import ContentBlock, { TextQR } from "../../../common/ContentBlock";
import { decode } from "@node-lightning/invoice";

const InvoicePane: React.FC = () => {
  const [invoice, setInvoice] = useState<string>("");
  let error = false;
  let result: ReturnType<typeof decode>;
  if (invoice !== "") {
    try {
      result = decode(invoice);
    } catch (e) {
      error = true;
    }
  }

  return (
    <div className="tab-pane is_active">
      <div className="tab-pane__content">
        <div className="box-operation__content">
          <div className="box-operation__invoice invoice">
            <form action="#" className="invoice__form">
              <div className="invoice__title">
                Pay Lightning Network invoice
              </div>
              <ContentBlock label="Invoice">
                <TextQR text="lnbc1pwr3fk2pp5zh36fav42ngkxfzywag42y06e03drpcujg38mq5gzkftdhp3phhsdqqcqzysvq8mgc5782mje6x0hgqd70pc83aa52g8pmpnc0j9x4pa3hrz3csp0ezl477f06ee4qmt4plcmmsftypy727w9zn06h9h6cz4n02t9qcp0c74yt" />
              </ContentBlock>
              <ContentBlock label="Swap details">
                <div className="invoice__block-text">
                  <div>
                    <strong>LN Paid:</strong> 0.01 LN
                  </div>
                  <div>
                    <strong>Swap Fee:</strong> 0.0001 LN
                  </div>
                  <div>
                    <strong>You’ll Get:</strong> 0.0099 tBTC
                  </div>
                </div>
              </ContentBlock>
              <div className="invoice__note">
                Note: Funds will be locked for 3 days if this transaction gets
                reverted
              </div>
              <ActionButton text="Waiting for Payment" type="loading" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePane;
