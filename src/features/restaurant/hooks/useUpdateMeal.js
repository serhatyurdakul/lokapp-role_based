import { useState, useEffect } from "react";
import { updateMealForRestaurant } from "@/utils/api";

const useUpdateMeal = (
  restaurantId,
  selectedMeal,
  onMealUpdated,
  onClose,
  isOpen
) => {
  const [newStock, setNewStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill stock and clear error when the modal opens
  useEffect(() => {
    if (isOpen && selectedMeal) {
      setNewStock(selectedMeal.quantity?.toString() || "");
      setError("");
    }
  }, [isOpen, selectedMeal]);

  const handleStockChange = (e) => {
    setNewStock(e.target.value);
    setError("");
  };

  const handleClearStock = () => {
    setNewStock("");
    setError("");
  };

  const handleUpdateMeal = async () => {
    setError("");

    if (!selectedMeal || !selectedMeal.id) {
      setError("Güncellenecek yemek seçilmedi.");
      return;
    }

    const stockValue = parseInt(newStock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      setError("Geçerli bir stok miktarı girin.");
      return;
    }

    if (!restaurantId) {
      setError("Restoran ID bulunamadı. Kullanıcı girişi kontrol edin.");
      return;
    }

    const updateData = {
      mealId: selectedMeal.id.toString(),
      quantity: stockValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      const response = await updateMealForRestaurant(updateData);
      onMealUpdated && onMealUpdated(response);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stockValue = Number(newStock);
  const isStockInvalid =
    newStock.trim() === "" || isNaN(stockValue) || stockValue < 0;
  const isSubmitDisabled = isSubmitting || isStockInvalid || !selectedMeal;

  return {
    newStock,
    isSubmitting,
    error,
    isSubmitDisabled,

    handleStockChange,
    handleClearStock,
    handleUpdateMeal,
  };
};

export default useUpdateMeal;
