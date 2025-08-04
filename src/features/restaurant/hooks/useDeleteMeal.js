import { useState, useEffect } from "react";
import { MSG_NETWORK_ERROR } from "@/constants/messages";
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


  const resetForm = () => {
    setError("");
  };


  const handleDeleteMeal = async (event) => {
    if (event) {
      event.preventDefault();
    }
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
      if (response && !response.error) {
        console.log("Yemek başarıyla silindi:", response.message);
        onMealDeleted && onMealDeleted(response);
        onClose();
      } else {
        setError(response?.message || "Yemek silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Yemek silme API çağrısı sırasında hata:", error);
      setError(MSG_NETWORK_ERROR);
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
    resetForm,
  };
};

export default useDeleteMeal;
