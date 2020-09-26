import React from 'react'

interface ModalProps {
    isOpen: boolean
    title: string
    buttonText: string
    onButtonClick: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, buttonText, children, onButtonClick }) => {
    return (
        isOpen ?
            <div className="jquery-modal blocker current">
                < div id="modal_code" className="modal modal-code" style={{ display: 'inline-block' }
                }>
                    <div className="modal__content">
                        <div className="modal__title">{title}</div>
                        <div className="modal__text">
                            {children}
                        </div>
                        <div className="modal__button row justify-end">
                            <button onClick={onButtonClick} className="btn" >{buttonText}</button>
                        </div>
                    </div>
                    <a href="#close-modal" rel="modal:close" className="close-modal ">Close</a>
                </div >
            </div >
            : null
    )
}

export default Modal