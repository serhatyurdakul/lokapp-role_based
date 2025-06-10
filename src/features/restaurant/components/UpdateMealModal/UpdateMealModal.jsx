import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormInput from "@/components/common/forms/FormInput/FormInput";

const UpdateMealModal = ({
  isOpen,
  onClose,
  title,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText,
  selectedMeal,
  newStock,
  onNewStockChange,
  onClearNewStock,
}) => {
  if (!selectedMeal) {
    return null; // Eğer seçili ürün yoksa modalı render etme
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryButtonText={primaryButtonText}
      onPrimaryAction={onPrimaryAction}
      secondaryButtonText={secondaryButtonText}
    >
      <h4>{selectedMeal.mealName}</h4>
      <FormInput
        label='Yeni Stok Miktarı'
        type='number'
        id='newStockModalInput'
        name='newStock'
        value={newStock}
        onChange={onNewStockChange}
        min='0'
        max={selectedMeal.maxStock !== undefined ? selectedMeal.maxStock : undefined}
        required
        isClearable={true}
        onClear={onClearNewStock}
      />
    </GenericModal>
  );
};

export default UpdateMealModal;
