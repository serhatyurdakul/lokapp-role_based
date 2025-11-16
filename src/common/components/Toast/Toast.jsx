import { useEffect } from "react";
import "./Toast.scss";

const Toast = ({ message, onClose, className = "", duration = 2000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

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
