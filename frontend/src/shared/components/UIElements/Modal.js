import React, {useRef} from "react";
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import './Backdrop'
import './Modal.css'
import Backdrop from "./Backdrop";

const ModalOverlay = props => {
    const modalRef = useRef();
    const content = (
        <div className={`modal ${props.className}`} style={props.style} ref={modalRef}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
{/*If set, call props on submit, else prevent default on event, so if we render any buttons inside form, we don't accidentally reload the page by triggering our form submission here. If we do provide our own submit function, then it's the duty of that submit function to prevent the default*/}
            <form onSubmit={
                props.onSubmit ? props.onSubmit: event => event.preventDefault()
                }>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    )
    return createPortal(content, document.getElementById('modal-hook'));
}

const Modal = props => {
    //Render Backdrop when modal is visible
    return (
        <>
        {props.show && <Backdrop onClick={props.onCancel}/>}
        <CSSTransition 
                in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
                {/* Forward all props to ModalOverlay taken by Modal */}
                <ModalOverlay {...props}/>
        </CSSTransition>
        </>
    )
}

export default Modal