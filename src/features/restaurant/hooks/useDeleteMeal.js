import { useState, useEffect } from "react";
import { deleteMealFromRestaurant } from "@/utils/api";

const useDeleteMeal = (
  restaurantId,
  selectedMeal,
  onMealDeleted,
  onClose,
  isOpen
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Reset error state when modal opens or selected meal changes
  useEffect(() => {
    if (isOpen && selectedMeal) {
      setError("");
    }
  }, [isOpen, selectedMeal]);

  const handleDeleteMeal = async () => {
    setError("");

    if (!selectedMeal || !selectedMeal.id) {
      setError("Silinecek yemek seçilmedi.");
      return;
    }

    if (!restaurantId) {
      setError("Restoran ID bulunamadı. Kullanıcı girişi kontrol edin.");
      return;
    }

    const deleteData = {
      mealId: selectedMeal.id.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsDeleting(true);
    try {
      const response = await deleteMealFromRestaurant(deleteData);
      onMealDeleted && onMealDeleted(response);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isSubmitDisabled = isDeleting || !selectedMeal;

  return {
    isDeleting,
    error,
    isSubmitDisabled,

    handleDeleteMeal,
  };
};

export default useDeleteMeal;
