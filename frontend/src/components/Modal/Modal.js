import React, {useContext} from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../../context/loginContext";
import "./Modal.css";

const Modal = ({ setModalOpen }) => {
  const { setUserLogin } = useContext(loginContext);
  const navigate = useNavigate();
  return (
    <div
      className="darkBg"
      onClick={() => {
        setModalOpen(false);
      }}
    >
      <div className="centered">
        <div className="modal">
          <div className="modal-header">
            <h5 className="heading">Confirm</h5>
          </div>
          <button
            className="close-btn"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <RiCloseLine />
          </button>
          <div className="modal-content">Do you really want to logout?</div>
          <div className="modal-actions">
            <div className="action-container">
              <button
                className="logout-btn"
                onClick={() => {
                  setModalOpen(false);
                  localStorage.clear();
                  setUserLogin(false)
                  navigate("/signin");
                }}
              >
                Log Out
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
