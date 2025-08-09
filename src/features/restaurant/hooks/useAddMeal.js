import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchMealOptionsByCategory, addRestaurantMeal } from "@/utils/api";
import { setLastAddedCategory } from "../store/restaurantMenuSlice";

const useAddMeal = (
  restaurantId,
  categories,
  initialCategoryId,
  onMealAdded,
  onClose,
  isOpen
) => {
  const dispatch = useDispatch();

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

  // Initialize selected category when the modal opens
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

  // Fetch meal templates whenever the selected category changes
  useEffect(() => {
    if (
      selectedCategoryInModal &&
      typeof selectedCategoryInModal === "number"
    ) {
      const loadMealOptions = async () => {
        const currentCategory = selectedCategoryInModal;
        setIsLoadingMealOptions(true);
        const optionsData = await fetchMealOptionsByCategory(currentCategory);
        // Sadece aynı kategori hâlâ seçiliyse state güncelle
        if (currentCategory === selectedCategoryInModal) {
          setMealOptions(optionsData || []);
          setFilteredMealOptions([]);
        }
        setIsLoadingMealOptions(false);
      };
      loadMealOptions();
    } else {
      setMealOptions([]);
      setFilteredMealOptions([]);
    }
  }, [selectedCategoryInModal]);

  // Hide search results when clicking outside the list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset all form-related state
  const resetFormStates = () => {
    setSearchQuery("");
    setNewStock("");
    setShowSearchResults(false);
    setSelectedMeal(null);
    setFilteredMealOptions([]);
    setMealExistsError("");
  };

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

  const handleMealOptionSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedMeal(null);

    if (query.length >= 1) {
      const filtered =
        mealOptions.length > 0
          ? mealOptions.filter((option) =>
              option.name
                .toLocaleLowerCase("tr-TR")
                .includes(query.toLocaleLowerCase("tr-TR"))
            )
          : [];

      setFilteredMealOptions(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredMealOptions([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectMealOption = (mealOption) => {
    setSearchQuery(mealOption.name);
    setSelectedMeal({
      id: mealOption.id,
      mealName: mealOption.name,
    });
    setShowSearchResults(false);
  };

  const handleClearMealOptionSearch = () => {
    setSearchQuery("");
    setSelectedMeal(null);
    setFilteredMealOptions([]);
    setShowSearchResults(false);
  };

  const handleAddMeal = async () => {
    setMealExistsError("");

    if (!selectedMeal || !selectedMeal.id) {
      return;
    }

    const stockValue = parseInt(newStock, 10);
    if (isNaN(stockValue) || stockValue <= 0) {
      return;
    }

    if (!restaurantId) {
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
      dispatch(setLastAddedCategory(selectedCategoryInModal));
      onMealAdded && onMealAdded(response);
      onClose();
    } catch (error) {
      setMealExistsError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derive disabled state for the primary button
  const stockValue = Number(newStock);
  const isStockInvalid =
    newStock.trim() === "" || isNaN(stockValue) || stockValue <= 0;

  const isButtonDisabledDueToFields = !selectedMeal || isStockInvalid;
  const finalIsPrimaryButtonDisabled =
    isSubmitting || isButtonDisabledDueToFields;

  return {
    searchQuery,
    showSearchResults,
    searchResultsRef,
    selectedCategoryInModal,
    newStock,
    selectedMeal,
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
  };
};

export default useAddMeal;
