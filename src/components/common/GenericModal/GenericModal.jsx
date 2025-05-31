import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { ReactComponent as CloseIcon } from "@/assets/icons/close.svg";
import Button from "../Button/Button";
import "./GenericModal.scss";

const GenericModal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText = "",
  onPrimaryAction = () => {},
  secondaryButtonText = "",
  onSecondaryAction = null,
  primaryButtonClassName = "",
  secondaryButtonClassName = "",
  isPrimaryButtonDisabled = false,
  primaryButtonLoading = false,
}) => {
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow || 'auto';
    const originalDocElementOverflow = document.documentElement.style.overflow || 'auto';
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocElementOverflow;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocElementOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const effectiveOnSecondaryAction = onSecondaryAction || onClose;

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={handleOverlayClick}>
      <div className='modal-content'>
        {title && (
          <div className='modal-header'>
            <h3 className='modal-title'>{title}</h3>
            <button className='close-btn' onClick={onClose} aria-label='Kapat'>
              <CloseIcon />
            </button>
          </div>
        )}
        <div className='modal-body'>{children}</div>
        {(primaryButtonText || secondaryButtonText) && (
          <div className='form-actions'>
            {secondaryButtonText && (
              <Button
                variant='secondary'
                onClick={effectiveOnSecondaryAction}
                className={secondaryButtonClassName}
                type='button'
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                variant='primary'
                onClick={onPrimaryAction}
                className={primaryButtonClassName}
                type='button'
                disabled={isPrimaryButtonDisabled}
                loading={primaryButtonLoading}
                loadingText={primaryButtonText}
              >
                {primaryButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

GenericModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  primaryButtonText: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  onSecondaryAction: PropTypes.func,
  primaryButtonClassName: PropTypes.string,
  secondaryButtonClassName: PropTypes.string,
  isPrimaryButtonDisabled: PropTypes.bool,
  primaryButtonLoading: PropTypes.bool,
};

export default GenericModal;
