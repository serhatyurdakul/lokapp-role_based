import PropTypes from "prop-types";
import GenericModal from "@/common/components/GenericModal/GenericModal.jsx";

const DiscardChangesModal = ({
  isOpen,
  onClose,
  onExit,
  title = "İşlemi Sonlandır",
  message = "Kaydedilmemiş değişiklikleriniz silinecek. Devam etmek istiyor musunuz?",
  exitText = "Çık",
  stayText = "Geri dön",
}) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      secondaryButtonText={exitText}
      secondaryButtonVariant='destructive-outline'
      onSecondaryAction={onExit}
      primaryButtonText={stayText}
      primaryButtonVariant='primary'
      onPrimaryAction={onClose}
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

