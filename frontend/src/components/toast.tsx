import { useEffect } from "react";

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-top toast-end z-50">
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        } shadow-lg max-w-sm`}
      >
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost btn-circle ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
