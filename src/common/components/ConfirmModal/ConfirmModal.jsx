import PropTypes from "prop-types";
import GenericModal from "../GenericModal/GenericModal.jsx";
import ErrorMessage from "../forms/ErrorMessage/ErrorMessage";

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
  const primaryClass = variant === "destructive" ? "btn-destructive" : "";
  const bodyContent = message ? (
    typeof message === "string" ? (
      <p>{message}</p>
    ) : (
      message
    )
  ) : null;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryButtonText={confirmText}
      onPrimaryAction={onConfirm}
      primaryButtonClassName={primaryClass}
      secondaryButtonText={cancelText}
      onSecondaryAction={onCancel || onClose}
      dialogRole={variant === "destructive" ? "alertdialog" : "dialog"}
      isPrimaryButtonDisabled={isConfirmDisabled}
      primaryButtonLoading={confirmLoading}
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
