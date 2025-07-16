import "./NoticeBanner.scss";

const NoticeBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="notice-banner" role="alert">
      <span className="notice-banner-message">{message}</span>
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
