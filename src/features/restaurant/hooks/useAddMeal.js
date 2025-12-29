import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchMealOptionsByCategory } from "@/utils/api";
import { setLastAddedCategory } from "@/features/restaurant/store/restaurantMenuSlice";

const STATUS_PRIORITY = {
  available: 0,
  pending: 1,
  inMenu: 2,
};

const useAddMeal = (
  restaurantId,
  categories,
  initialCategoryId,
  options = {}
) => {
  const {
    submitHandler,
    isMealAlreadyAdded,
    isMealInMenu,
  } = options;
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef(null);
  const [selectedCategoryInModal, setSelectedCategoryInModal] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealOptions, setMealOptions] = useState([]);
  const [filteredMealOptions, setFilteredMealOptions] = useState([]);
  const [isLoadingMealOptions, setIsLoadingMealOptions] = useState(false);
  const [mealExistsError, setMealExistsError] = useState("");

  const mealAlreadyAddedChecker =
    typeof isMealAlreadyAdded === "function"
      ? isMealAlreadyAdded
      : () => false;
  const mealInMenuChecker =
    typeof isMealInMenu === "function" ? isMealInMenu : () => false;

  // Initialize selected category when dependencies change
  useEffect(() => {
    resetFormStates();

    if (initialCategoryId && typeof initialCategoryId === "number") {
      setSelectedCategoryInModal(initialCategoryId);
    } else if (categories.length > 0 && categories[0]?.id) {
      setSelectedCategoryInModal(categories[0].id);
    } else {
      setSelectedCategoryInModal("");
    }
  }, [initialCategoryId, categories]);

  // Fetch meal templates whenever the selected category changes
  useEffect(() => {
    if (
      selectedCategoryInModal &&
      typeof selectedCategoryInModal === "number"
    ) {
      const currentCategory = selectedCategoryInModal;
      setIsLoadingMealOptions(true);
      const loadMealOptions = async () => {
        const optionsData = await fetchMealOptionsByCategory(currentCategory);
        // Sadece aynı kategori hâlâ seçiliyse state güncelle ve loading'i kapat
        if (currentCategory === selectedCategoryInModal) {
          setMealOptions(optionsData || []);
          setFilteredMealOptions([]);
          setIsLoadingMealOptions(false);
        }
      };
      loadMealOptions();
    } else {
      setMealOptions([]);
      setFilteredMealOptions([]);
      // Kategori seçili değilken loading açık kalmasın
      setIsLoadingMealOptions(false);
    }
  }, [selectedCategoryInModal]);

  // Reset all form-related state
  const resetFormStates = () => {
    setSearchQuery("");
    setQuantityInput("");
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
    setQuantityInput("");
  };

  const handleMealOptionSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedMeal(null);

    setMealExistsError("");

    if (query.length >= 1) {
      const loweredQuery = query.toLocaleLowerCase("tr-TR");
      const filtered =
        mealOptions.length > 0
          ? mealOptions
              .filter((option) =>
                option.name
                  .toLocaleLowerCase("tr-TR")
                  .includes(loweredQuery)
              )
              .map((option) => {
                const status = (() => {
                  if (mealAlreadyAddedChecker(option)) {
                    return "pending";
                  }
                  if (mealInMenuChecker(option)) {
                    return "inMenu";
                  }
                  return "available";
                })();

                return {
                  ...option,
                  status,
                  isDisabled: status !== "available",
                };
              })
              .sort((a, b) => {
                const priorityA =
                  STATUS_PRIORITY[a.status] ?? Number.POSITIVE_INFINITY;
                const priorityB =
                  STATUS_PRIORITY[b.status] ?? Number.POSITIVE_INFINITY;

                if (priorityA !== priorityB) {
                  return priorityA - priorityB;
                }

                const nameA = a.name || "";
                const nameB = b.name || "";
                return nameA.localeCompare(nameB, "tr-TR", {
                  sensitivity: "base",
                });
              })
          : [];

      setFilteredMealOptions(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredMealOptions([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectMealOption = (mealOption) => {
    const status = (() => {
      if (mealOption?.status) return mealOption.status;
      if (mealAlreadyAddedChecker(mealOption)) {
        return "pending";
      }
      if (mealInMenuChecker(mealOption)) {
        return "inMenu";
      }
      return "available";
    })();

    if (status === "pending" || status === "inMenu") {
      setMealExistsError("");
      setSelectedMeal(null);
      return;
    }

    setMealExistsError("");
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

    const quantityValue = parseInt(quantityInput, 10);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      return;
    }

    if (!restaurantId) {
      return;
    }

    const mealToAdd = {
      mealMenuId: selectedMeal.id.toString(),
      quantity: quantityValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      if (typeof submitHandler === "function") {
        const result = await submitHandler({
          selectedMeal,
          quantity: quantityValue,
          selectedCategoryId: selectedCategoryInModal,
          payload: mealToAdd,
        });

        dispatch(setLastAddedCategory(selectedCategoryInModal));

        if (result !== false) {
          resetFormStates();
        }

        return result ?? null;
      }
    } catch (error) {
      const message = error?.message || "Bir hata oluştu";
      setMealExistsError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derive disabled state for the primary button
  const quantityValue = Number(quantityInput);
  const isQuantityInvalid =
    quantityInput.trim() === "" || isNaN(quantityValue) || quantityValue <= 0;

  const isButtonDisabledDueToFields = !selectedMeal || isQuantityInvalid;
  const finalIsPrimaryButtonDisabled =
    isSubmitting || isButtonDisabledDueToFields;

  return {
    searchQuery,
    showSearchResults,
    searchResultsRef,
    selectedCategoryInModal,
    quantityInput,
    selectedMeal,
    isSubmitting,
    filteredMealOptions,
    isLoadingMealOptions,
    mealExistsError,
    finalIsPrimaryButtonDisabled,
    setQuantityInput,
    handleModalCategoryChange,
    handleMealOptionSearchChange,
    handleSelectMealOption,
    handleClearMealOptionSearch,
    handleAddMeal,
  };
};

export default useAddMeal;
