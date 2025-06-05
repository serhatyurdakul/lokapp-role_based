import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormInput from "@/components/common/forms/FormInput/FormInput";

const StockUpdateModal = ({
  isOpen,
  onClose,
  title,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText,
  selectedItem,
  newStock,
  onNewStockChange,
  onClearNewStock,
}) => {
  if (!selectedItem) {
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
      <h4>{selectedItem.item}</h4>
      <FormInput
        label='Yeni Stok Miktarı'
        type='number'
        id='newStockModalInput'
        name='newStock'
        value={newStock}
        onChange={onNewStockChange}
        min='0'
        max={selectedItem.total !== undefined ? selectedItem.total : undefined}
        required
        isClearable={true}
        onClear={onClearNewStock}
      />
    </GenericModal>
  );
};

export default StockUpdateModal;
