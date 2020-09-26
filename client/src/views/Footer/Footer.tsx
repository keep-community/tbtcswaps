import React from "react";
import Modal from "../Modal";
/* import "./Footer.css"; */
import modalData from "./modal-data"

export default function Footer() {
  const [dialogId, setDialogId] = React.useState<string>('');

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-id') ?? ''
    setDialogId(id)
  }

  const handleClose = () => {
    setDialogId('')
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__row row align-end justify-between">
            <div className="footer__left">
              <div className="footer__site">
                <span>tbtcswaps.com</span><br />Swap Engine
              </div>
            </div>
            <nav className="footer__right">
              <ul className="footer__menu menu">
                <li className="menu__item"><button data-id="code" onClick={handleNavClick} className="menu__link">Code</button></li>
                <li className="menu__item"><button data-id="docs" onClick={handleNavClick} className="menu__link">Docs</button></li>
                <li className="menu__item"><button data-id="about" onClick={handleNavClick} className="menu__link">About</button></li>
                <li className="menu__item"><button data-id="contact-us" onClick={handleNavClick} className="menu__link">Contact us</button></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
      <Modal title={modalData[dialogId]?.title} isOpen={!!dialogId} buttonText={modalData[dialogId]?.buttonText}
        onButtonClick={handleClose} >
        {modalData[dialogId]?.content}
      </Modal>
    </>
  );
}