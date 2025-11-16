import "./NoticeBanner.scss";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/icons/reload.svg";

const NoticeBanner = ({ message, onClose, actionText, onAction }) => {
  if (!message) return null;

  return (
    <div className='notice-banner' role='alert'>
      <span className='notice-banner-message'>{message}</span>
      {actionText && onAction && (
        <button
          type='button'
          className='notice-banner-action'
          onClick={onAction}
          aria-label={actionText}
        >
          <RefreshIcon /> {actionText}
        </button>
      )}
      {onClose && (
        <button
          className='notice-banner-close'
          onClick={onClose}
          aria-label='Kapat'
          type='button'
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default NoticeBanner;
