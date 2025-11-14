import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./MenuPage.scss";
import CustomDropdown from "@/components/common/CustomDropdown/CustomDropdown";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import EmptyState from "@/components/common/StateMessage/EmptyState";
import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import Toast from "@/components/common/Toast/Toast.jsx";
// Local sentinel value to indicate no category filter applied
const ALL_FILTER = "all";
import { ReactComponent as AddIcon } from "@/assets/icons/add.svg";
import { ReactComponent as MoreIcon } from "@/assets/icons/more.svg";
import { ReactComponent as EditIcon } from "@/assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "@/assets/icons/delete.svg";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal.jsx";
import useDeleteMeal from "../../hooks/useDeleteMeal";
import {
  fetchRestaurantCategories,
  fetchRestaurantMenuData,
  selectMenuMealsAndCategories,
} from "../../store/restaurantMenuSlice";
import StockBadge from "@/components/common/StockBadge/StockBadge";

// Extracted outside component to keep stable reference

const groupMealsByCategory = (meals) => {
  if (!meals || meals.length === 0) return {};

  const groups = {};

  // Group meals by category
  meals.forEach((meal) => {
    const categoryName = meal.categoryName || "Diğer";

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(meal);
  });

  return groups;
};

const MenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { info: restaurantInfo } = useSelector((state) => state.restaurantInfo);
  const {
    isLoading,
    error,
  } = useSelector((state) => state.restaurantMenu);
  const restaurantId = user?.restaurantId;
  const orderCutoffTime =
    restaurantInfo?.orderCutoffTime ||
    user?.restaurant?.orderCutoffTime ||
    "11:00";

  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealForDelete, setSelectedMealForDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMealForUpdate, setSelectedMealForUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [showBanner, setShowBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [pendingFocusMealId, setPendingFocusMealId] = useState(null);

  const loadAllRestaurantData = useCallback(() => {
    dispatch(fetchRestaurantCategories());
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    loadAllRestaurantData();
  }, [loadAllRestaurantData]);

  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

  useEffect(() => {
    const { toast: stateToast, focusMealId } = location.state || {};
    const shouldReset = Boolean(stateToast) || Boolean(focusMealId);

    if (stateToast) {
      setToastMessage(stateToast);
    }

    if (focusMealId) {
      setPendingFocusMealId(String(focusMealId));
    }

    if (shouldReset) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdownId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const { menuMeals, categoriesForFilterBar } = useSelector(
    selectMenuMealsAndCategories
  );

  // Reset filter to ALL if selected category is removed
  useEffect(() => {
    if (
      selectedCategory !== ALL_FILTER &&
      !categoriesForFilterBar.some((c) => c.id === selectedCategory)
    ) {
      setSelectedCategory(ALL_FILTER);
    }
  }, [categoriesForFilterBar, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  const handleEdit = useCallback((meal) => {
    setOpenDropdownId(null);
    setSelectedMealForUpdate(meal);
    setIsUpdateModalOpen(true);
  }, []);

  const toggleDropdown = (mealId) => {
    setOpenDropdownId((prev) => (prev === mealId ? null : mealId));
  };

  const handleDropdownEdit = (meal) => {
    setOpenDropdownId(null);
    handleEdit(meal);
  };

  const handleDropdownDelete = (meal) => {
    setOpenDropdownId(null);
    setSelectedMealForDelete(meal);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedMealForDelete(null);
  };

  // Helper to refetch menu data
  const loadRestaurantMenu = useCallback(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const handleMealDeleted = () => {
    loadRestaurantMenu();
    setToastMessage("Yemek silindi");
  };

  const {
    isDeleting,
    error: deleteError,
    isSubmitDisabled,
    handleDeleteMeal,
  } = useDeleteMeal(
    restaurantId,
    selectedMealForDelete,
    handleMealDeleted,
    closeDeleteModal,
    isDeleteConfirmOpen
  );
  const selectedMealOrderCount =
    (selectedMealForDelete?.orderCount &&
      Number(selectedMealForDelete.orderCount)) ||
    0;

  const closeUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedMealForUpdate(null);
  }, []);

  const handleMealUpdated = useCallback(() => {
    closeUpdateModal();
    loadRestaurantMenu();
    setToastMessage("Yemek güncellendi");
  }, [closeUpdateModal, loadRestaurantMenu]);

  useEffect(() => {
    if (!pendingFocusMealId) return;

    const targetMeal = menuMeals.find(
      (meal) => String(meal.id) === String(pendingFocusMealId)
    );

    if (targetMeal) {
      handleEdit(targetMeal);
      setPendingFocusMealId(null);
      return;
    }

    if (pendingFocusMealId && menuMeals.length > 0) {
      setPendingFocusMealId(null);
    }
  }, [pendingFocusMealId, menuMeals, handleEdit]);

  const filteredMeals = useMemo(
    () =>
      selectedCategory === ALL_FILTER
        ? menuMeals
        : menuMeals.filter(
            (meal) => String(meal.categoryId) === selectedCategory
          ),
    [menuMeals, selectedCategory]
  );

  const searchedMeals = useMemo(() => {
    if (!searchQuery) return filteredMeals;
    const q = searchQuery.trim().toLowerCase();
    return filteredMeals.filter((meal) =>
      String(meal.mealName || "")
        .toLowerCase()
        .includes(q)
    );
  }, [filteredMeals, searchQuery]);

  // Memo: compute grouped meals for display
  const mealsForDisplay = useMemo(() => {
    if (selectedCategory === ALL_FILTER) {
      // When ALL is selected, group the text-filtered meals (searchedMeals) by category
      return groupMealsByCategory(searchedMeals);
    } else {
      // Show meals only for the selected category
      const categoryName =
        categoriesForFilterBar.find((cat) => cat.id === selectedCategory)
          ?.name || "";

      // If search yields no results for the selected category, render nothing
      return searchedMeals.length > 0 ? { [categoryName]: searchedMeals } : {};
    }
  }, [searchedMeals, selectedCategory, categoriesForFilterBar]);

  const hasSearch = searchQuery.trim().length > 0;

  // Render body based on data state
  const renderBody = () => {
    // Full-screen spinner while menu data is loading
    if (isLoading && menuMeals.length === 0) {
      return <Loading text='Menü yükleniyor...' />;
    }

    // Empty state when there are no meals
    if (menuMeals.length === 0) {
      return <EmptyState message='Henüz yemek eklemediniz' />;
    }

    if (hasSearch && searchedMeals.length === 0) {
      return (
        <div className='search-no-results'>Arama sonucuna uygun yemek bulunamadı.</div>
      );
    }

    // Regular content
    return (
      <div className='menupage-items-by-category'>
        {Object.entries(mealsForDisplay).map(([categoryName, meals]) => (
          <div key={categoryName} className='menupage-category-section'>
            <h3 className='menupage-category-title'>{categoryName}</h3>
            <div className='menupage-category-grid'>
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className='menupage-food-card'
                  onClick={() => handleEdit(meal)}
                >
                  <div className='menupage-food-card-image'>
                    <img
                      src={meal.imageUrl || "https://via.placeholder.com/150"}
                      alt={meal.mealName}
                    />
                  </div>
                  <div className='menupage-food-card-content'>
                    <h3 className='menupage-food-card-name'>{meal.mealName}</h3>
                    <div className='menupage-food-card-stock-info'>
                      <div className='menupage-food-card-stock-details'>
                        <StockBadge
                          remaining={meal.currentStock}
                          sold={meal.orderCount}
                        />
                      </div>
                      <div className='meal-actions-wrapper'>
                        <button
                          className='meal-actions-trigger'
                          aria-label='Seçenekler'
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(meal.id);
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openDropdownId === meal.id && (
                          <div
                            className='meal-actions-dropdown'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className='dropdown-item'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDropdownEdit(meal);
                              }}
                            >
                              <EditIcon />
                              <span>Düzenle</span>
                            </div>
                            <div
                              className='dropdown-item delete'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDropdownDelete(meal);
                              }}
                            >
                              <DeleteIcon />
                              <span>Sil</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {openDropdownId !== null && (
        // Backdrop captures outside clicks so they don't trigger card onClick (edit)
        <div
          className='meal-actions-backdrop'
          onClick={() => setOpenDropdownId(null)}
        />
      )}
      <PageHeader title='Menü'>
        <button className='add-button' onClick={() => navigate("/menu/new")}>
          <AddIcon className='icon' />
          <span>Yemek Ekle</span>
        </button>
      </PageHeader>
      <div className='cutoff-info'>
        <span className='cutoff-info__text'>
          Sipariş alımı {orderCutoffTime}’da kapanır.
        </span>
        <button
          type='button'
          className='cutoff-info__link'
          onClick={() => navigate("/settings/order-cutoff")}
        >
          Saati ayarla
        </button>
      </div>

      <div className='menu-filters'>
        {/** Category dropdown */}
        <CustomDropdown
          options={[
            { value: ALL_FILTER, label: "Tüm Kategoriler" },
            ...categoriesForFilterBar.map((c) => ({
              value: String(c.id),
              label: c.name,
            })),
          ]}
          selectedValue={selectedCategory}
          onSelect={handleCategoryChange}
          placeholder='Kategori seçiniz'
        />

        {/** Search input */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder='Yemek Ara...'
        />
      </div>
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText='Yenile'
          onAction={loadAllRestaurantData}
          onClose={() => setShowBanner(false)}
        />
      )}
      {renderBody()}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteModal}
        title='Yemek Sil'
        message={
          selectedMealForDelete ? (
            <>
              <h4>{selectedMealForDelete.mealName}</h4>
              {selectedMealOrderCount > 0 && (
                <p>
                  Şu anda {selectedMealOrderCount} kişi bu yemeği sipariş etti. Silerseniz mevcut sipariş kayıtlarında görünmeye devam eder.
                </p>
              )}
              <p className='menu-delete-warning'>
                Bu yemeği silmek istediğinize emin misiniz?
              </p>
            </>
          ) : (
            <p className='menu-delete-warning'>
              Bu yemeği silmek istediğinize emin misiniz?
            </p>
          )
        }
        confirmText='Sil'
        cancelText='Vazgeç'
        onConfirm={handleDeleteMeal}
        variant='destructive'
        isConfirmDisabled={isSubmitDisabled}
        confirmLoading={isDeleting}
        errorMessage={deleteError}
      />

      <UpdateMealModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        selectedMeal={selectedMealForUpdate}
        restaurantId={restaurantId}
        onMealUpdated={handleMealUpdated}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </>
  );
};

export default MenuPage;
