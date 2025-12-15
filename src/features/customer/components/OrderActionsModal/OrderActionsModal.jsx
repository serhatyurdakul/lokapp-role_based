import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import GenericModal from "@/common/components/modals/GenericModal/GenericModal.jsx";
import "./OrderActionsModal.scss";

const OrderActionsModal = ({
  isOpen,
  onClose,
  onRequestEdit,
  onRequestCancel,
  cutoffTime = "11:00",
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowCancelConfirm(false);
    }
  }, [isOpen]);

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    onRequestCancel && onRequestCancel();
  };

  const title = showCancelConfirm ? "Siparişi İptal Et" : "Siparişi Düzenle";
  const dialogRole = showCancelConfirm ? "alertdialog" : "dialog";

  const primaryButtonText = showCancelConfirm ? "Vazgeç" : "Düzenle";
  const secondaryButtonText = showCancelConfirm ? "İptal Et" : "Kapat";

  const onPrimaryAction = showCancelConfirm
    ? () => setShowCancelConfirm(false)
    : onRequestEdit;
  const onSecondaryAction = showCancelConfirm ? handleConfirmCancel : onClose;

  const primaryButtonVariant = showCancelConfirm ? "secondary" : "primary";
  const secondaryButtonVariant = showCancelConfirm ? "destructive" : "secondary";

	  return (
	    <GenericModal
	      isOpen={isOpen}
	      onClose={onClose}
	      closeOnOverlayClick={!showCancelConfirm}
	      title={title}
	      primaryButtonVariant={primaryButtonVariant}
	      primaryButtonText={primaryButtonText}
	      onPrimaryAction={onPrimaryAction}
	      secondaryButtonVariant={secondaryButtonVariant}
	      secondaryButtonText={secondaryButtonText}
	      onSecondaryAction={onSecondaryAction}
	      dialogRole={dialogRole}
	    >
	      {showCancelConfirm ? (
	        <div className='order-actions__content'>
          <p className='order-actions__note'>
            Bu siparişi iptal etmek istediğinize emin misiniz?
          </p>
        </div>
      ) : (
        <div className='order-actions__content'>
          <p className='order-actions__note'>
            Siparişlerinizi {cutoffTime}’e kadar düzenleyebilir veya iptal edebilirsiniz.
          </p>
          <button
            type='button'
            className='order-actions__link order-actions__link--destructive'
            onClick={() => setShowCancelConfirm(true)}
          >
            Siparişi İptal Et
          </button>
        </div>
      )}
    </GenericModal>
  );
};

OrderActionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestEdit: PropTypes.func,
  onRequestCancel: PropTypes.func,
  cutoffTime: PropTypes.string,
};

export default OrderActionsModal;
