import { useEffect } from "react";
import "./Toast.scss";

const Toast = ({ message, onClose, className = "" }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`toast ${className}`.trim()}
      role='alert'
      aria-live='assertive'
    >
      {message}
    </div>
  );
};

export default Toast;
