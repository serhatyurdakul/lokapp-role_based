import { useEffect } from "react";
import "./Toast.scss";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast" role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default Toast;
