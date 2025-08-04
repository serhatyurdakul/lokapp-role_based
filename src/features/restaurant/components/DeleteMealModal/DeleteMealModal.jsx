import GenericModal from "@/components/common/GenericModal/GenericModal";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import useDeleteMeal from "../../hooks/useDeleteMeal";
import PropTypes from "prop-types";

const DeleteMealModal = ({
  isOpen,
  onClose,
  selectedMeal,
  restaurantId,
  onMealDeleted,
}) => {
  const { isDeleting, error, isSubmitDisabled, handleDeleteMeal } =
    useDeleteMeal(restaurantId, selectedMeal, onMealDeleted, onClose, isOpen);

  if (!selectedMeal) {
    return null;
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yemek Sil"
      primaryButtonText={isDeleting ? "Siliniyor..." : "Sil"}
      onPrimaryAction={handleDeleteMeal}
      isPrimaryButtonDisabled={isSubmitDisabled}
      primaryButtonClassName="btn-destructive"
      secondaryButtonText="İptal"
      onSecondaryAction={onClose}
      primaryButtonLoading={isDeleting}
    >
      <ErrorMessage message={error} />
      <h4>{selectedMeal.mealName}</h4>
      <p>Bu yemeği silmek istediğinizden emin misiniz?</p>
      <p>Bu işlem geri alınamaz</p>
    </GenericModal>
  );
};

DeleteMealModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMeal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mealName: PropTypes.string,
  }),
  restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onMealDeleted: PropTypes.func,
};

export default DeleteMealModal;
