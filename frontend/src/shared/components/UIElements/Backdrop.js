import React from 'react';
import { createPortal } from 'react-dom';
import './Backdrop.css';

const Backdrop = (props) => {
  const close = <div className="backdrop" onClick={props.onClick} />
  return createPortal(close, document.getElementById('backdrop-hook'));
};

export default Backdrop;
