import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import useUpdateMeal from "../../hooks/useUpdateMeal";

const UpdateMealModal = ({
  isOpen,
  onClose,
  selectedMeal,
  restaurantId,
  onMealUpdated,
}) => {
  // Hook'dan tüm logic'i al
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
    return null; // Eğer seçili ürün yoksa modalı render etme
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title='Stok Güncelle'
      primaryButtonText={isSubmitting ? "Güncelleniyor..." : "Güncelle"}
      onPrimaryAction={handleUpdateMeal}
      isPrimaryButtonDisabled={isSubmitDisabled}
      showSecondaryButton={true}
      secondaryButtonText='İptal'
      onSecondaryAction={onClose}
      isLoading={isSubmitting}
    >
      <ErrorMessage message={error} />
      <h4>{selectedMeal.mealName}</h4>
      <FormInput
        label='Yeni Stok Miktarı'
        type='number'
        id='newStockModalInput'
        name='newStock'
        value={newStock}
        onChange={handleStockChange}
        min='0'
        max={
          selectedMeal.maxStock !== undefined
            ? selectedMeal.maxStock
            : undefined
        }
        required
        isClearable={true}
        onClear={handleClearStock}
      />
    </GenericModal>
  );
};

export default UpdateMealModal;
