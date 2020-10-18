import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

const ModalRoot = document.getElementById("modal-root") as HTMLDivElement;
const el = document.createElement("div");

const Modal = ({ children }: { children: any }) => {
  useEffect(() => {
    ModalRoot.appendChild(el);
    return () => {
      ModalRoot.removeChild(el);
    };
  }, []);
  return ReactDOM.createPortal(children, el);
};

export default Modal;
