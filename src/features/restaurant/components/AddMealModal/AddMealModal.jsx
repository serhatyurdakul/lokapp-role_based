import { useState, useEffect, useRef } from "react";
import GenericModal from "@/components/common/GenericModal/GenericModal";
import FormSelect from "@/components/common/forms/FormSelect/FormSelect";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import { fetchMealOptionsByCategory, addRestaurantMeal } from "@/utils/api";
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
  // Modal içindeki state'ler
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef(null);
  const [selectedCategoryInModal, setSelectedCategoryInModal] = useState("");
  const [newStock, setNewStock] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  const [filteredMealOptions, setFilteredMealOptions] = useState([]);
  const [isLoadingMealOptions, setIsLoadingMealOptions] = useState(false);
  const [mealExistsError, setMealExistsError] = useState("");

  // Modal açıldığında kategori seçimi
  useEffect(() => {
    if (isOpen) {
      resetFormStates();
      
      if (initialCategoryId && typeof initialCategoryId === "number") {
        setSelectedCategoryInModal(initialCategoryId);
      } else if (categories.length > 0 && categories[0]?.id) {
        setSelectedCategoryInModal(categories[0].id);
      } else {
        setSelectedCategoryInModal("");
      }
    }
  }, [isOpen, initialCategoryId, categories]);

  // Kategori seçildiğinde yemek şablonlarını çekme
  useEffect(() => {
    if (selectedCategoryInModal && typeof selectedCategoryInModal === "number") {
      const loadMealOptions = async () => {
        setIsLoadingMealOptions(true);
        const optionsData = await fetchMealOptionsByCategory(selectedCategoryInModal);
        setMealOptions(optionsData || []);
        setFilteredMealOptions([]);
        setIsLoadingMealOptions(false);
      };
      loadMealOptions();
    } else {
      setMealOptions([]);
      setFilteredMealOptions([]);
    }
  }, [selectedCategoryInModal]);

  // Arama sonuçları dışına tıklandığında listeyi gizleme
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Form state'lerini sıfırlama
  const resetFormStates = () => {
    setSearchQuery("");
    setNewStock("");
    setShowSearchResults(false);
    setSelectedMeal(null);
    setFilteredMealOptions([]);
    setMealExistsError("");
  };

  // Modal'daki kategori değişimini izleme
  const handleModalCategoryChange = (e) => {
    const newCategoryIdString = e.target.value;
    const newCategoryId = newCategoryIdString
      ? parseInt(newCategoryIdString, 10)
      : "";

    setSelectedCategoryInModal(newCategoryId);
    setSearchQuery("");
    setMealOptions([]);
    setShowSearchResults(false);
    setSelectedMeal(null);
    setFilteredMealOptions([]);
    setMealExistsError("");
  };

  // Yemek arama
  const handleMealOptionSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedMeal(null);

    if (query.length >= 1 && mealOptions.length > 0) {
      const filtered = mealOptions.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMealOptions(filtered);
      setShowSearchResults(filtered.length > 0);
    } else {
      setFilteredMealOptions([]);
      setShowSearchResults(false);
    }
  };

  // Arama sonuçlarından yemek seçme
  const handleSelectMealOption = (mealOption) => {
    setSearchQuery(mealOption.name);
    setSelectedMeal({
      id: mealOption.id,
      mealName: mealOption.name,
    });
    setShowSearchResults(false);
  };

  // Yemek adı input'unu temizleme
  const handleClearMealOptionSearch = () => {
    setSearchQuery("");
    setSelectedMeal(null);
    setFilteredMealOptions([]);
    setShowSearchResults(false);
  };

  // Form gönderme
  const handleAddMeal = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setMealExistsError("");

    if (!selectedMeal || !selectedMeal.id) {
      console.error("Lütfen bir yemek adı seçin.");
      return;
    }

    const stockValue = parseInt(newStock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      console.error("Geçerli bir stok miktarı girin.");
      return;
    }

    if (!restaurantId) {
      console.error("Restoran ID bulunamadı. Kullanıcı girişi kontrol edin.");
      return;
    }

    const mealToAdd = {
      mealMenuId: selectedMeal.id.toString(),
      quantity: stockValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      const response = await addRestaurantMeal(mealToAdd);
      if (response && !response.error) {
        console.log("Yemek başarıyla eklendi:", response.message);
        onMealAdded && onMealAdded(response);
        onClose();
      } else {
        if (
          response &&
          response.error &&
          response.message &&
          response.message.includes("Bu yemek günlük menüde bulunmaktadır")
        ) {
          setMealExistsError(response.message);
        } else {
          console.error(
            "Yemek ekleme başarısız:",
            response?.message || "Bilinmeyen bir hata oluştu."
          );
          setMealExistsError(
            response?.message ||
              "Yemek eklenirken bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      }
    } catch (error) {
      console.error(
        "Yemek ekleme API çağrısı sırasında bir hata oluştu:",
        error
      );
      setMealExistsError(
        "Sunucuyla iletişim kurulamadı. Lütfen tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal butonunun disabled durumunu belirlemek
  const stockValue = Number(newStock);
  const isStockInvalid =
    newStock.trim() === "" || isNaN(stockValue) || stockValue <= 0;

  const isButtonDisabledDueToFields = !selectedMeal || isStockInvalid;
  const finalIsPrimaryButtonDisabled = isSubmitting || isButtonDisabledDueToFields;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Yemek Ekle"
      primaryButtonText={isSubmitting ? "Ekleniyor..." : "Ekle"}
      onPrimaryAction={handleAddMeal}
      isPrimaryButtonDisabled={finalIsPrimaryButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonText="İptal"
      onSecondaryAction={onClose}
      isLoading={isLoadingCategories || isLoadingMealOptions || isSubmitting}
    >
      <form className='menu-form'>
        <ErrorMessage message={mealExistsError} />
        <FormSelect
          label='Kategori'
          id='category-modal-select'
          name='category'
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

        <div className='search-input-container'>
          <FormInput
            label='Yemek Adı'
            id='name-modal-input'
            name='name'
            type='text'
            value={searchQuery}
            onChange={handleMealOptionSearchChange}
            placeholder='Yemek adını yazarak arayın'
            autoComplete='off'
            required
            isClearable={true}
            onClear={handleClearMealOptionSearch}
          />
          {isLoadingMealOptions && (
            <div className='search-loading'>Yemekler yükleniyor...</div>
          )}
          {!isLoadingMealOptions &&
            showSearchResults &&
            filteredMealOptions.length > 0 && (
              <div className='search-results' ref={searchResultsRef}>
                {filteredMealOptions.map((mealOption) => (
                  <div
                    key={mealOption.id || mealOption.name}
                    className='search-result-item'
                    onClick={() => handleSelectMealOption(mealOption)}
                  >
                    {mealOption.name}
                  </div>
                ))}
              </div>
            )}
          {!isLoadingMealOptions &&
            showSearchResults &&
            searchQuery.length > 0 &&
            filteredMealOptions.length === 0 && (
              <div className='search-no-results'>
                "{searchQuery}" ile eşleşen yemek bulunamadı.
              </div>
            )}
        </div>

        <FormInput
          label='Stok Miktarı'
          id='stock-modal-input'
          name='stock'
          type='number'
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder='Stok miktarını girin'
          min='0'
          required
          isClearable={true}
          onClear={() => setNewStock("")}
        />
      </form>
    </GenericModal>
  );
};

export default AddMealModal; 