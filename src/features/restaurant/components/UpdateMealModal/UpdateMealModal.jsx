import { useEffect, useState } from "react";
import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import useUpdateMeal from "../../hooks/useUpdateMeal";
import PropTypes from "prop-types";
import "./UpdateMealModal.scss";

const UpdateMealModal = ({
  isOpen,
  onClose,
  selectedMeal,
  restaurantId,
  onMealUpdated,
  mode = "api",
  onPendingUpdate,
  onPendingRemove,
}) => {
  const isPendingMode = mode === "pending";

  const {
    newStock,
    isSubmitting,
    error,
    isSubmitDisabled,
    handleStockChange,
    handleClearStock,
    markSoldOut,
    handleUpdateMeal,
  } = useUpdateMeal(
    restaurantId,
    selectedMeal,
    onMealUpdated,
    onClose,
    isOpen,
    { enabled: !isPendingMode }
  );

  const [pendingQuantity, setPendingQuantity] = useState("");
  const [pendingError, setPendingError] = useState("");

  useEffect(() => {
    if (isPendingMode && isOpen && selectedMeal) {
      setPendingQuantity(selectedMeal.quantity?.toString() || "");
      setPendingError("");
    }
  }, [isPendingMode, isOpen, selectedMeal]);

  if (!selectedMeal) {
    return null;
  }

  const handlePendingQuantityChange = (event) => {
    setPendingQuantity(event.target.value);
    setPendingError("");
  };

  const handlePendingClear = () => {
    setPendingQuantity("");
    setPendingError("");
  };

  const handlePendingUpdateSubmit = () => {
    const parsed = parseInt(pendingQuantity, 10);

    if (Number.isNaN(parsed) || parsed < 0) {
      setPendingError("Geçerli bir porsiyon sayısı girin.");
      return;
    }

    onPendingUpdate?.({ ...selectedMeal, quantity: parsed });
  };

  const handlePendingRemoveClick = () => {
    onPendingRemove?.(selectedMeal);
  };

  const labelText = isPendingMode ? "Porsiyon Sayısı" : "Kalan Porsiyon Sayısı";
  const quantityValue = isPendingMode ? pendingQuantity : newStock;
  const primaryDisabled = isPendingMode
    ? pendingQuantity.trim() === "" || Number.isNaN(Number(pendingQuantity)) || Number(pendingQuantity) < 0
    : isSubmitDisabled;
  const primaryAction = isPendingMode ? handlePendingUpdateSubmit : handleUpdateMeal;
  const errorMessage = isPendingMode ? pendingError : error;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title='Porsiyon Güncelle'
      primaryButtonText={isPendingMode ? "Güncelle" : isSubmitting ? "Güncelleniyor..." : "Güncelle"}
      onPrimaryAction={primaryAction}
      isPrimaryButtonDisabled={primaryDisabled}
      secondaryButtonText='İptal'
      onSecondaryAction={onClose}
    >
      <div className='update-meal-modal'>
        <ErrorMessage message={errorMessage} />
        <h4>{selectedMeal.mealName}</h4>
        <FormInput
          label={labelText}
          placeholder='Örneğin: 50'
          type='number'
          id='newStockModalInput'
          name='newStock'
          value={quantityValue}
          onChange={isPendingMode ? handlePendingQuantityChange : handleStockChange}
          min='0'
          inputMode='numeric'
          required
          isClearable={true}
          onClear={isPendingMode ? handlePendingClear : handleClearStock}
        />
        <div className={`update-meal__tertiary ${
          isPendingMode ? "update-meal__tertiary--pending" : ""
        }`}
        >
          <button
            type='button'
            onClick={isPendingMode ? handlePendingRemoveClick : markSoldOut}
            aria-label={isPendingMode ? 'Listeden kaldır' : 'Tükendi yap'}
            className={`update-meal__link ${
              isPendingMode ? "update-meal__link--destructive" : ""
            }`}
          >
            {isPendingMode ? "Listeden kaldır" : "Tükendi yap"}
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

UpdateMealModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMeal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mealName: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMealUpdated: PropTypes.func,
  mode: PropTypes.oneOf(["api", "pending"]),
  onPendingUpdate: PropTypes.func,
  onPendingRemove: PropTypes.func,
};

export default UpdateMealModal;
