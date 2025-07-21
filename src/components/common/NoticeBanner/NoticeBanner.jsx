import "./NoticeBanner.scss";

const NoticeBanner = ({ message, onClose, actionText, onAction }) => {
  if (!message) return null;

  return (
    <div className="notice-banner" role="alert">
      <span className="notice-banner-message">{message}</span>
      {actionText && onAction && (
        <button
          type="button"
          className="notice-banner-action"
          onClick={onAction}
          aria-label={actionText}
        >
          ↻ {actionText}
        </button>
      )}
      {onClose && (
        <button
          className="notice-banner-close"
          onClick={onClose}
          aria-label="Kapat"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default NoticeBanner;
