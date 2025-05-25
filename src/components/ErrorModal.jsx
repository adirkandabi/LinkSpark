import React from "react";

const ErrorModal = ({ show, onClose, message = "Something went wrong." }) => {
  return (
    <div
      className={`modal fade ${
        show
          ? "show d-flex justify-content-center align-items-center"
          : "d-none"
      }`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Error</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body ">
            <p style={{ fontSize: "20px", fontWeight: "600" }}>
              {message.charAt(0).toUpperCase() + message.slice(1)}
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
