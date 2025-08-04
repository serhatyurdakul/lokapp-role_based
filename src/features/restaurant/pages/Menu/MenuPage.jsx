import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MenuPage.scss";
import FilterBar, {
  ALL as ALL_FILTER,
} from "@/components/common/FilterBar/FilterBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import EmptyState from "@/components/common/StateMessage/EmptyState";
import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import { ReactComponent as AddIcon } from "@/assets/icons/add.svg";
import { ReactComponent as MoreIcon } from "@/assets/icons/more.svg";
import { ReactComponent as EditIcon } from "@/assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "@/assets/icons/delete.svg";
import AddMealModal from "../../components/AddMealModal/AddMealModal";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import DeleteMealModal from "../../components/DeleteMealModal/DeleteMealModal";
import {
  fetchRestaurantCategories,
  fetchRestaurantMenuData,
  selectMenuMealsAndCategories,
} from "../../store/restaurantMenuSlice";
import { getStockStatus } from "../../utils/stockUtils";

const sortMenuData = (menuDataToSort) => {
  if (!menuDataToSort || menuDataToSort.length === 0) {
    return [];
  }

  // Deep copy to avoid mutating original data
  // Manual spread preserves Date objects
  const sortedData = menuDataToSort.map((categoryGroup) => ({
    ...categoryGroup,
    // Also shallow-copy meal objects
    meals: (categoryGroup.meals || []).map((meal) => ({ ...meal })),
  }));

  // Sort meals in each category by createdAt (newest first)
  sortedData.forEach((categoryGroup) => {
    if (categoryGroup.meals && categoryGroup.meals.length > 0) {
      categoryGroup.meals.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      // Cache newest meal date for category sorting
      categoryGroup.latestMealCreatedAt = categoryGroup.meals[0].createdAt;
    } else {
      // Use epoch date for empty categories so they sort last
      categoryGroup.latestMealCreatedAt = "1970-01-01T00:00:00Z";
    }
  });

  // Sort categories by newest meal date (recent first)
  sortedData.sort((a, b) => {
    return (
      new Date(b.latestMealCreatedAt).getTime() -
      new Date(a.latestMealCreatedAt).getTime()
    );
  });

  return sortedData;
};

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

  const { user } = useSelector((state) => state.auth);
  const {
    categories: apiCategories,
    menuData: restaurantMenuData,
    isLoading,
    error,
    lastAddedCategoryId,
  } = useSelector((state) => state.restaurantMenu);
  const restaurantId = user?.restaurantId;

  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);
  const [showAddMealModal, setShowAddMealModal] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [selectedMealForDelete, setSelectedMealForDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    dispatch(fetchRestaurantCategories());
  }, [dispatch]);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

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

  const openAddMealModal = () => {
    setShowAddMealModal(true);
  };

  const closeAddMealModal = () => {
    setShowAddMealModal(false);
  };

  const handleMealAdded = () => {
    loadRestaurantMenu();
  };

  const openUpdateModal = (meal) => {
    setSelectedMeal(meal);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedMeal(null);
  };

  const handleMealUpdated = () => {
    loadRestaurantMenu();
  };

  const handleEdit = (meal) => {
    openUpdateModal(meal);
  };

  const toggleDropdown = (mealId) => {
    setOpenDropdownId(openDropdownId === mealId ? null : mealId);
  };

  const handleDropdownEdit = (meal) => {
    setOpenDropdownId(null);
    handleEdit(meal);
  };

  const handleDropdownDelete = (meal) => {
    setOpenDropdownId(null);
    setSelectedMealForDelete(meal);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMealForDelete(null);
  };

  const handleMealDeleted = () => {
    loadRestaurantMenu();
  };

  const filteredMeals = useMemo(
    () =>
      selectedCategory === ALL_FILTER
        ? menuMeals
        : menuMeals.filter(
            (meal) => String(meal.categoryId) === selectedCategory
          ),
    [menuMeals, selectedCategory]
  );

  // Memo: compute grouped meals for display
  const mealsForDisplay = useMemo(() => {
    if (selectedCategory === ALL_FILTER) {
      // Group meals by category when ALL selected
      return groupMealsByCategory(filteredMeals);
    } else {
      // Show meals only for the selected category
      const categoryName =
        categoriesForFilterBar.find((cat) => cat.id === selectedCategory)
          ?.name || "";

      return { [categoryName]: filteredMeals };
    }
  }, [filteredMeals, selectedCategory, categoriesForFilterBar]);

  // Helper to refetch menu data
  const loadRestaurantMenu = useCallback(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  // Render body based on data state
  const renderBody = () => {
    // Full-screen spinner while menu data is loading
    if (isLoading && menuMeals.length === 0) {
      return <Loading text="Menü yükleniyor..." />;
    }

    // Empty state when there are no meals
    if (menuMeals.length === 0) {
      return <EmptyState message="Henüz yemek eklemediniz" />;
    }

    // Regular content
    return (
      <div className="menupage-items-by-category">
        {Object.entries(mealsForDisplay).map(([categoryName, meals]) => (
          <div key={categoryName} className="menupage-category-section">
            <h3 className="menupage-category-title">{categoryName}</h3>
            <div className="menupage-category-grid">
              {meals.map((meal) => (
                <div key={meal.id} className="menupage-food-card">
                  <div className="menupage-food-card-image">
                    <img
                      src={meal.imageUrl || "https://via.placeholder.com/150"}
                      alt={meal.mealName}
                    />
                  </div>
                  <div className="menupage-food-card-content">
                    <h3 className="menupage-food-card-name">{meal.mealName}</h3>
                    <span className="menupage-food-card-category-tag">
                      {meal.categoryName ||
                        apiCategories.find(
                          (cat) => String(cat.id) === String(meal.categoryId)
                        )?.name ||
                        "Bilinmiyor"}
                    </span>
                    <div className="menupage-food-card-stock-info">
                      <div className="menupage-food-card-stock-details">
                        <span
                          className={`menupage-food-card-stock-badge ${getStockStatus(
                            meal.currentStock
                          )}`}
                        >
                          {meal.currentStock} / {meal.quantity} porsiyon
                        </span>
                      </div>
                      <div className="meal-actions-wrapper">
                        <button
                          className="meal-actions-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(meal.id);
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openDropdownId === meal.id && (
                          <div className="meal-actions-dropdown">
                            <div
                              className="dropdown-item"
                              onClick={() => handleDropdownEdit(meal)}
                            >
                              <EditIcon />
                              <span>Düzenle</span>
                            </div>
                            <div
                              className="dropdown-item delete"
                              onClick={() => handleDropdownDelete(meal)}
                            >
                              <DeleteIcon />
                              <span>Sil</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="menupage-food-card-stock-bar">
                        <div
                          className="menupage-food-card-stock-progress"
                          style={{
                            width: `${
                              meal.quantity
                                ? Math.min(
                                    Math.max(
                                      (meal.currentStock ?? 0) / meal.quantity,
                                      0
                                    ),
                                    1
                                  ) * 100
                                : 0
                            }%`,
                            backgroundColor:
                              getStockStatus(meal.currentStock) === "good"
                                ? "var(--success-color)"
                                : "var(--warning-color)",
                          }}
                        ></div>
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
      <PageHeader title="Menü Yönetimi">
        <button
          className={`add-button ${showAddMealModal ? "disabled" : ""}`}
          onClick={openAddMealModal}
        >
          <AddIcon className="icon" />
          <span>Yeni Yemek</span>
        </button>
      </PageHeader>

      <FilterBar
        options={categoriesForFilterBar}
        selectedValue={selectedCategory}
        onChange={handleCategoryChange}
      />
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText="Yenile"
          onAction={loadRestaurantMenu}
          onClose={() => setShowBanner(false)}
        />
      )}
      {renderBody()}

      <AddMealModal
        isOpen={showAddMealModal}
        onClose={closeAddMealModal}
        categories={apiCategories}
        restaurantId={restaurantId}
        initialCategoryId={lastAddedCategoryId}
        onMealAdded={handleMealAdded}
        isLoadingCategories={isLoading}
      />

      <UpdateMealModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        selectedMeal={selectedMeal}
        restaurantId={restaurantId}
        onMealUpdated={handleMealUpdated}
      />

      <DeleteMealModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        selectedMeal={selectedMealForDelete}
        restaurantId={restaurantId}
        onMealDeleted={handleMealDeleted}
      />
    </>
  );
};

export default MenuPage;
