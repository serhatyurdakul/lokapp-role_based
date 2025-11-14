import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import GenericModal from "@/components/common/GenericModal/GenericModal.jsx";
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
  const primaryButtonText = showCancelConfirm ? "İptal Et" : "Düzenle";
  const secondaryButtonText = showCancelConfirm ? "Vazgeç" : "Kapat";
  const onPrimaryAction = showCancelConfirm
    ? handleConfirmCancel
    : onRequestEdit;
  const onSecondaryAction = showCancelConfirm
    ? () => setShowCancelConfirm(false)
    : onClose;
  const primaryButtonClassName = showCancelConfirm ? "btn-destructive" : "";
  const dialogRole = showCancelConfirm ? "alertdialog" : "dialog";

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryButtonText={primaryButtonText}
      onPrimaryAction={onPrimaryAction}
      secondaryButtonText={secondaryButtonText}
      onSecondaryAction={onSecondaryAction}
      primaryButtonClassName={primaryButtonClassName}
      dialogRole={dialogRole}
    >
      {showCancelConfirm ? (
        <div className='order-actions-content'>
          <p className='order-actions__note'>
            Bu siparişi iptal etmek istediğinize emin misiniz?
          </p>
        </div>
      ) : (
        <div className='order-actions-content'>
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
