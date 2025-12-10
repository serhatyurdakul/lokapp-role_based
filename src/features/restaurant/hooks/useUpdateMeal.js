import { useState, useEffect } from "react";
import { updateMealForRestaurant } from "@/utils/api";

const useUpdateMeal = (
  restaurantId,
  selectedMeal,
  onMealUpdated,
  onClose,
  isOpen,
  options = {}
) => {
  const { autoCloseOnSuccess = true, enabled = true } = options;
  const [quantityInput, setQuantityInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill quantity and clear error when the modal opens
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (isOpen && selectedMeal) {
      setQuantityInput(selectedMeal.quantity?.toString() || "");
      setError("");
    }
  }, [enabled, isOpen, selectedMeal]);

  const handleQuantityChange = (e) => {
    setQuantityInput(e.target.value);
    setError("");
  };

  const handleClearQuantity = () => {
    setQuantityInput("");
    setError("");
  };

  const markSoldOut = () => {
    setQuantityInput("0");
    setError("");
  };

  const handleUpdateMeal = async () => {
    if (!enabled) {
      return;
    }

    setError("");

    if (!selectedMeal || !selectedMeal.id) {
      setError("Güncellenecek yemek seçilmedi.");
      return;
    }

    const quantityValue = parseInt(quantityInput, 10);
    if (isNaN(quantityValue) || quantityValue < 0) {
      setError("Geçerli bir porsiyon sayısı girin.");
      return;
    }

    if (!restaurantId) {
      setError("Restoran ID bulunamadı. Kullanıcı girişi kontrol edin.");
      return;
    }

    const updateData = {
      mealId: selectedMeal.id.toString(),
      quantity: quantityValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      const response = await updateMealForRestaurant(updateData);
      onMealUpdated && onMealUpdated(response);
      if (autoCloseOnSuccess) {
        onClose?.();
      }
      return response;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }

    return null;
  };

  const quantityValue = Number(quantityInput);
  const isQuantityInvalid =
    quantityInput.trim() === "" || isNaN(quantityValue) || quantityValue < 0;
  const isSubmitDisabled =
    !enabled || isSubmitting || isQuantityInvalid || !selectedMeal;

  return {
    quantityInput,
    isSubmitting,
    error,
    isSubmitDisabled,

    handleQuantityChange,
    handleClearQuantity,
    markSoldOut,
    handleUpdateMeal,
  };
};

export default useUpdateMeal;
