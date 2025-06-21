import { useState, useEffect } from "react";
import { updateMealForRestaurant } from "@/utils/api";

const useUpdateMeal = (
  restaurantId,
  selectedMeal,
  onMealUpdated,
  onClose,
  isOpen
) => {
  // State'ler
  const [newStock, setNewStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Modal açıldığında form'u reset et ve mevcut stock'u set et
  useEffect(() => {
    if (isOpen && selectedMeal) {
      setNewStock(selectedMeal.currentStock?.toString() || "");
      setError("");
    }
  }, [isOpen, selectedMeal]);

  // Form'u reset etme
  const resetForm = () => {
    setNewStock("");
    setError("");
  };

  // Stock değişimi handler'ı
  const handleStockChange = (e) => {
    setNewStock(e.target.value);
    setError(""); // Kullanıcı yazmaya başladığında error'u temizle
  };

  // Stock temizleme handler'ı
  const handleClearStock = () => {
    setNewStock("");
    setError("");
  };

  // Update işlemi
  const handleUpdateMeal = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setError("");

    // Validation
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

    // API çağrısı için data hazırlama
    const updateData = {
      mealId: selectedMeal.id.toString(),
      quantity: stockValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      const response = await updateMealForRestaurant(updateData);
      if (response && !response.error) {
        console.log("Yemek başarıyla güncellendi:", response.message);
        onMealUpdated && onMealUpdated(response);
        onClose();
      } else {
        setError(response?.message || "Yemek güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Yemek güncelleme API çağrısı sırasında hata:", error);
      setError("Sunucuyla iletişim kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit butonunun disabled durumu
  const stockValue = Number(newStock);
  const isStockInvalid =
    newStock.trim() === "" || isNaN(stockValue) || stockValue < 0;
  const isSubmitDisabled = isSubmitting || isStockInvalid || !selectedMeal;

  return {
    // State values
    newStock,
    isSubmitting,
    error,
    isSubmitDisabled,

    // Handlers
    handleStockChange,
    handleClearStock,
    handleUpdateMeal,
    resetForm,
  };
};

export default useUpdateMeal;
