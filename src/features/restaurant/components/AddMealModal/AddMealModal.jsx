import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormSelect from "@/components/common/forms/FormSelect/FormSelect";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import useAddMeal from "../../hooks/useAddMeal";
import "./AddMealModal.scss";

const AddMealModal = ({
  isOpen,
  onClose,
  categories,
  restaurantId,
  initialCategoryId,
  onMealAdded,
  isLoadingCategories,
}) => {
  const {
    searchQuery,
    showSearchResults,
    searchResultsRef,
    selectedCategoryInModal,
    newStock,
    isSubmitting,
    filteredMealOptions,
    isLoadingMealOptions,
    mealExistsError,
    finalIsPrimaryButtonDisabled,
    setNewStock,
    handleModalCategoryChange,
    handleMealOptionSearchChange,
    handleSelectMealOption,
    handleClearMealOptionSearch,
    handleAddMeal,
  } = useAddMeal(
    restaurantId,
    categories,
    initialCategoryId,
    onMealAdded,
    onClose,
    isOpen
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Yemek Ekle"
      primaryButtonText={isSubmitting ? "Ekleniyor..." : "Ekle"}
      onPrimaryAction={handleAddMeal}
      isPrimaryButtonDisabled={finalIsPrimaryButtonDisabled}
      secondaryButtonText="İptal"
      onSecondaryAction={onClose}
    >
      <form className="menu-form" autoComplete="off">
        <ErrorMessage message={mealExistsError} />
        <FormSelect
          label="Kategori"
          id="category-modal-select"
          name="category"
          value={selectedCategoryInModal}
          onChange={handleModalCategoryChange}
          options={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          defaultOptionText={
            isLoadingCategories ? "Kategoriler Yükleniyor..." : null
          }
          required
          disabled={isLoadingCategories}
        />

        <div className="search-input-container">
          <FormInput
            label="Yemek Ara"
            id="name-modal-input"
            name="name"
            type="text"
            value={searchQuery}
            onChange={handleMealOptionSearchChange}
            placeholder="Yemek adı arayın"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            required
            isClearable={true}
            onClear={handleClearMealOptionSearch}
            isSearchable={true}
          />
          {isLoadingMealOptions && (
            <div className="search-loading">Yemekler yükleniyor...</div>
          )}
          {!isLoadingMealOptions && showSearchResults && (
            <div className="search-results" ref={searchResultsRef}>
              {filteredMealOptions.length > 0 ? (
                filteredMealOptions.map((mealOption) => (
                  <div
                    key={mealOption.id || mealOption.name}
                    className="search-result-item"
                    onClick={() => handleSelectMealOption(mealOption)}
                  >
                    {mealOption.name}
                  </div>
                ))
              ) : (
                <div
                  className="search-result-item no-match"
                  aria-disabled="true"
                >
                  "{searchQuery}" ile eşleşen yemek bulunamadı.
                </div>
              )}
            </div>
          )}
        </div>

        <FormInput
          label="Porsiyon Sayısı"
          id="stock-modal-input"
          name="stock"
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Örneğin: 50"
          min="0"
          autoComplete="off"
          required
          isClearable={true}
          onClear={() => setNewStock("")}
        />
      </form>
    </GenericModal>
  );
};

export default AddMealModal;
