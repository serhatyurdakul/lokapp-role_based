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
        label="Yeni Stok Miktarı"
        type="number"
        id="newStockModalInput" // ID aynı kalacak
        name="newStock" // name aynı kalacak
        value={newStock}
        onChange={onNewStockChange} // Prop üzerinden gelen handler
        min="0" // min attribute'ü aynı kalacak
        max={
          selectedItem.total !== undefined ? selectedItem.total : undefined
        } // max attribute'ü aynı kalacak
        required // required attribute'ü aynı kalacak
        isClearable={true} // isClearable aynı kalacak
        onClear={onClearNewStock} // Prop üzerinden gelen handler
      />
    </GenericModal>
  );
};

export default StockUpdateModal; 