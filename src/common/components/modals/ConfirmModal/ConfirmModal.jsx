import PropTypes from "prop-types";
import GenericModal from "../GenericModal/GenericModal.jsx";
import ErrorMessage from "../../forms/ErrorMessage/ErrorMessage";

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  onConfirm = () => {},
  onCancel = null,
  variant = "destructive", // 'destructive' | 'default'
  isConfirmDisabled = false,
  confirmLoading = false,
  errorMessage = "",
}) => {
  const isDestructive = variant === "destructive";
  const bodyContent = message ? (
    typeof message === "string" ? (
      <p>{message}</p>
    ) : (
      message
    )
  ) : null;

  const safeAction = onCancel || onClose;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isDestructive}
      title={title}
      dialogRole={isDestructive ? "alertdialog" : "dialog"}
      primaryButtonVariant={isDestructive ? "secondary" : "primary"}
      primaryButtonText={isDestructive ? cancelText : confirmText}
      onPrimaryAction={isDestructive ? safeAction : onConfirm}
      secondaryButtonVariant={isDestructive ? "destructive" : "secondary"}
      secondaryButtonText={isDestructive ? confirmText : cancelText}
      onSecondaryAction={isDestructive ? onConfirm : safeAction}
      isSecondaryButtonDisabled={isDestructive ? isConfirmDisabled : false}
      secondaryButtonLoading={isDestructive ? confirmLoading : false}
      secondaryButtonLoadingText={isDestructive ? confirmText : ""}
      isPrimaryButtonDisabled={!isDestructive ? isConfirmDisabled : false}
      primaryButtonLoading={!isDestructive ? confirmLoading : false}
    >
      <ErrorMessage message={errorMessage} />
      {bodyContent}
    </GenericModal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  variant: PropTypes.oneOf(["destructive", "default"]),
  isConfirmDisabled: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default ConfirmModal;
