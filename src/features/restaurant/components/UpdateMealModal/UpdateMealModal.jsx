import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import useUpdateMeal from "../../hooks/useUpdateMeal";
import PropTypes from "prop-types";

const UpdateMealModal = ({
  isOpen,
  onClose,
  selectedMeal,
  restaurantId,
  onMealUpdated,
}) => {
  const {
    newStock,
    isSubmitting,
    error,
    isSubmitDisabled,
    handleStockChange,
    handleClearStock,
    handleUpdateMeal,
  } = useUpdateMeal(restaurantId, selectedMeal, onMealUpdated, onClose, isOpen);

  if (!selectedMeal) {
    return null;
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Kalan Porsiyon Sayısı"
      primaryButtonText={isSubmitting ? "Güncelleniyor..." : "Güncelle"}
      onPrimaryAction={handleUpdateMeal}
      isPrimaryButtonDisabled={isSubmitDisabled}
      secondaryButtonText="İptal"
      onSecondaryAction={onClose}
    >
      <ErrorMessage message={error} />
      <h4>{selectedMeal.mealName}</h4>
      <FormInput
        label="Kalan Porsiyon Sayısı"
        placeholder="Örneğin: 50"
        type="number"
        id="newStockModalInput"
        name="newStock"
        value={newStock}
        onChange={handleStockChange}
        min="0"
        required
        isClearable={true}
        onClear={handleClearStock}
      />
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
  restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onMealUpdated: PropTypes.func,
};

export default UpdateMealModal;
