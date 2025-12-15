import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import "./GenericModal.scss";

const GenericModal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonVariant = "primary",
  primaryButtonText = "",
  onPrimaryAction = () => {},
  secondaryButtonVariant = "secondary",
  secondaryButtonText = "",
  onSecondaryAction = null,
  primaryButtonClassName = "",
  secondaryButtonClassName = "",
  isPrimaryButtonDisabled = false,
  primaryButtonLoading = false,
  dialogRole = "dialog",
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow || 'auto';
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
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
    <div
      className='modal-overlay'
      onClick={handleOverlayClick}
      role='presentation'
    >
      <div
        className='modal-content'
        role={dialogRole}
        aria-modal='true'
        aria-label={title}
      >
        {title && (
          <div className='modal-header'>
            <h3 className='modal-title'>
              {title}
            </h3>
          </div>
        )}
        <div className='modal-body'>{children}</div>
        {(primaryButtonText || secondaryButtonText) && (
          <div className='form-actions'>
            {secondaryButtonText && (
              <Button
                variant={secondaryButtonVariant}
                onClick={effectiveOnSecondaryAction}
                className={secondaryButtonClassName}
                type='button'
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                variant={primaryButtonVariant}
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
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  primaryButtonVariant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline-primary",
    "destructive",
    "destructive-outline",
  ]),
  primaryButtonText: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  secondaryButtonVariant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline-primary",
    "destructive",
    "destructive-outline",
  ]),
  secondaryButtonText: PropTypes.string,
  onSecondaryAction: PropTypes.func,
  primaryButtonClassName: PropTypes.string,
  secondaryButtonClassName: PropTypes.string,
  isPrimaryButtonDisabled: PropTypes.bool,
  primaryButtonLoading: PropTypes.bool,
  dialogRole: PropTypes.oneOf(["dialog", "alertdialog"]),
};

export default GenericModal;
