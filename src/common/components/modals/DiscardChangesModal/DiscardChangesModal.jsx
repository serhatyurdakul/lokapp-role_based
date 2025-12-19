import PropTypes from "prop-types";
import GenericModal from "../GenericModal/GenericModal.jsx";

const DiscardChangesModal = ({
  isOpen,
  onClose,
  onExit,
  title = "İşlemi Sonlandır",
  message = "Kaydedilmemiş değişiklikleriniz silinecek. Çıkmak istiyor musunuz?",
  exitText = "Çık",
  stayText = "Geri dön",
}) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      title={title}
      secondaryButtonText={stayText}
      secondaryButtonVariant='secondary'
      onSecondaryAction={onClose}
      primaryButtonText={exitText}
      primaryButtonVariant='destructive'
      onPrimaryAction={onExit}
      dialogRole='alertdialog'
    >
      <p>{message}</p>
    </GenericModal>
  );
};

DiscardChangesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  exitText: PropTypes.string,
  stayText: PropTypes.string,
};

export default DiscardChangesModal;
