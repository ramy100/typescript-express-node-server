import ReactDOM from "react-dom";
import "./Modal.scss";

const ModalRoot = document.getElementById("modal-root") as HTMLDivElement;

const Modal = ({ children }: { children: any }) => {
  return ReactDOM.createPortal(children, ModalRoot);
};

export default Modal;
