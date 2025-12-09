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
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill quantity and clear error when the modal opens
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (isOpen && selectedMeal) {
      setQuantity(selectedMeal.quantity?.toString() || "");
      setError("");
    }
  }, [enabled, isOpen, selectedMeal]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setError("");
  };

  const handleClearQuantity = () => {
    setQuantity("");
    setError("");
  };

  const markSoldOut = () => {
    setQuantity("0");
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

    const quantityValue = parseInt(quantity, 10);
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

  const quantityValue = Number(quantity);
  const isQuantityInvalid =
    quantity.trim() === "" || isNaN(quantityValue) || quantityValue < 0;
  const isSubmitDisabled =
    !enabled || isSubmitting || isQuantityInvalid || !selectedMeal;

  return {
    quantity,
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
