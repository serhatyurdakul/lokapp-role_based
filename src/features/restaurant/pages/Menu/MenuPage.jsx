import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MenuPage.scss";
import FilterBar from "@/components/common/FilterBar/FilterBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { ReactComponent as AddIcon } from "@/assets/icons/add.svg";
import { ReactComponent as MoreIcon } from "@/assets/icons/more.svg";
import { ReactComponent as EditIcon } from "@/assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "@/assets/icons/delete.svg";
import Button from "@/components/common/Button/Button";
import AddMealModal from "../../components/AddMealModal/AddMealModal";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import {
  fetchRestaurantCategories,
  fetchRestaurantMenuData,
} from "../../store/restaurantMenuSlice";

const sortMenuData = (menuDataToSort) => {
  if (!menuDataToSort || menuDataToSort.length === 0) {
    return [];
  }

  // Orijinal veriyi değiştirmemek için iki seviyeli kopya alma
  // JSON.parse(JSON.stringify()) yerine manuel .map spread yaklaşımı: Date nesneleri bozulmaz
  const sortedData = menuDataToSort.map((categoryGroup) => ({
    ...categoryGroup,
    // meal dizisinin de kopyasını alıyoruz, meal objelerini de shallow kopyalıyoruz
    meals: (categoryGroup.meals || []).map((meal) => ({ ...meal })),
  }));

  // 1. Her kategori içindeki yemekleri createdAt e göre sırala (en yeni en üstte)
  sortedData.forEach((categoryGroup) => {
    if (categoryGroup.meals && categoryGroup.meals.length > 0) {
      categoryGroup.meals.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      // Kategori grubuna en yeni yemeğin tarihini ekle (kategorileri sıralamak için)
      categoryGroup.latestMealCreatedAt = categoryGroup.meals[0].createdAt;
    } else {
      // Eğer kategoride hiç yemek yoksa, sıralamada sona düşmesi için çok eski bir tarih ata
      categoryGroup.latestMealCreatedAt = "1970-01-01T00:00:00Z";
    }
  });

  // 2. Kategorileri, içerdikleri en yeni yemeğin createdAt ine göre sırala (en son yemek eklenen kategori en üstte)
  sortedData.sort((a, b) => {
    return (
      new Date(b.latestMealCreatedAt).getTime() -
      new Date(a.latestMealCreatedAt).getTime()
    );
  });

  return sortedData;
};

// Bu fonksiyon bileşene bağımlı olmadığı için dışarıya taşındı.
// Bu, her render'da yeniden oluşturulmasını engeller.
const groupMealsByCategory = (meals) => {
  if (!meals || meals.length === 0) return {};

  const groups = {};

  // Her yemeği kategorisine göre grupla
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

  // Redux state'lerini alma
  const { user } = useSelector((state) => state.auth);
  const {
    categories: apiCategories,
    menuData: restaurantMenuData,
    isLoading,
    lastAddedCategoryId,
  } = useSelector((state) => state.restaurantMenu);
  const restaurantId = user?.restaurantId;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [lastSelectedCategory, setLastSelectedCategory] = useState("");

  // UpdateMeal Modal state
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    // Kategorileri çek
    dispatch(fetchRestaurantCategories());
  }, [dispatch]);

  useEffect(() => {
    // Restoran menüsünü çek
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdownId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const { menuMeals, categoriesForFilterBar } = useMemo(() => {
    if (!restaurantMenuData || restaurantMenuData.length === 0) {
      return { menuMeals: [], categoriesForFilterBar: [] };
    }

    // Orijinal veriyi sırala. sortMenuData zaten verinin kopyasını alıyor.
    const sortedMenuData = sortMenuData(restaurantMenuData);

    // Tüm yemekleri, ek bilgilerle birlikte düz bir diziye çevir.
    const allMeals = sortedMenuData.flatMap((categoryGroup) =>
      (categoryGroup.meals || []).map((meal) => ({
        ...meal,
        currentStock: meal.quantity,
        maxStock: meal.maxStock || 100,
        mealName: meal.name,
        imageUrl: meal.photoUrl,
      }))
    );

    // FilterBar için benzersiz kategorileri oluştur.
    const uniqueCategories = [
      ...new Map(
        sortedMenuData.map((item) => [
          item.categoryId,
          { id: item.categoryId, name: item.categoryName },
        ])
      ).values(),
    ];

    return { menuMeals: allMeals, categoriesForFilterBar: uniqueCategories };
  }, [restaurantMenuData]);

  // Kategori değişimi (FilterBar için)
  const handleCategoryChange = (categoryValue) => {
    let newSelectedCategory = categoryValue;
    if (categoryValue !== "all" && typeof categoryValue === "string") {
      const parsedId = parseInt(categoryValue, 10);
      if (!isNaN(parsedId)) {
        newSelectedCategory = parsedId;
      } else {
        console.error(
          `FilterBar'dan geçersiz kategori ID'si geldi: ${categoryValue}. 'all' kategorisine dönülüyor.`
        );
        newSelectedCategory = "all";
      }
    }
    setSelectedCategory(newSelectedCategory);
  };

  const openAddMealModal = () => {
    setShowAddMealModal(true);
  };

  const closeAddMealModal = () => {
    setShowAddMealModal(false);
  };

  const handleMealAdded = () => {
    // Başarı veya hata durumunda veriyi yeniden çekerek UI'ı güncel tut.
    loadRestaurantMenu();
  };

  // UpdateMeal Modal actions
  const openUpdateModal = (meal) => {
    setSelectedMeal(meal);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedMeal(null);
  };

  const handleMealUpdated = () => {
    // Başarı veya hata durumunda veriyi yeniden çekerek UI'ı güncel tut.
    loadRestaurantMenu();
  };

  const handleEdit = (meal) => {
    openUpdateModal(meal);
  };

  // Dropdown handlers
  const toggleDropdown = (mealId) => {
    setOpenDropdownId(openDropdownId === mealId ? null : mealId);
  };

  const handleDropdownEdit = (meal) => {
    setOpenDropdownId(null);
    handleEdit(meal);
  };

  const handleDropdownDelete = (meal) => {
    setOpenDropdownId(null);
    // Şimdilik hiçbir şey yapmayacak
  };

  const filteredMeals = useMemo(
    () =>
      selectedCategory === "all"
        ? menuMeals
        : menuMeals.filter((meal) => meal.categoryId === selectedCategory),
    [menuMeals, selectedCategory]
  );

  //Ekranda gösterilecek son veriyi (gruplanmış) hesaplayan useMemo.
  const mealsForDisplay = useMemo(() => {
    if (selectedCategory === "all") {
      // Tüm kategoriler seçiliyse, yemekleri kategorilere göre grupla.
      return groupMealsByCategory(filteredMeals);
    } else {
      // Tek bir kategori seçiliyse, sadece o kategorinin yemeklerini göster.
      const categoryName =
        apiCategories.find((cat) => cat.id === selectedCategory)?.name ||
        "Seçili Kategori";
      return { [categoryName]: filteredMeals };
    }
  }, [filteredMeals, selectedCategory, apiCategories]);

  // Refresh için helper function
  const loadRestaurantMenu = () => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  };

  return (
    <>
      <PageHeader title='Menü Yönetimi'>
        <button
          className={`add-button ${showAddMealModal ? "disabled" : ""}`}
          onClick={openAddMealModal}
        >
          <AddIcon className='icon' />
          <span>Yeni Yemek</span>
        </button>
      </PageHeader>

      <FilterBar
        categories={categoriesForFilterBar}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading && <p>Menü yükleniyor...</p>}
      {!isLoading &&
        Object.keys(mealsForDisplay).length === 0 &&
        menuMeals.length === 0 && (
          // Hiç ürün yoksa (api den hiç gelmediyse)
          <div className='empty-menu-message'>
            <p>Menüde henüz hiç yemek bulunmuyor. Hemen ekleyin!</p>
          </div>
        )}
      {!isLoading &&
        Object.keys(mealsForDisplay).length === 0 &&
        menuMeals.length > 0 &&
        selectedCategory !== "all" && (
          // Belirli bir kategori seçili ama o kategoride ürün yoksa
          <div className='empty-menu-message'>
            <p>Bu kategoride henüz yemek bulunmuyor.</p>
          </div>
        )}

      {!isLoading && Object.keys(mealsForDisplay).length > 0 && (
        <div className='menupage-items-by-category'>
          {Object.entries(mealsForDisplay).map(([categoryName, meals]) => (
            <div key={categoryName} className='menupage-category-section'>
              <h3 className='menupage-category-title'>{categoryName}</h3>
              <div className='menupage-category-grid'>
                {meals.map((meal) => (
                  <div key={meal.id} className='menupage-food-card'>
                    <div className='menupage-food-card-image'>
                      <img
                        src={meal.imageUrl || "https://via.placeholder.com/150"}
                        alt={meal.mealName}
                      />
                    </div>
                    <div className='menupage-food-card-content'>
                      <h3 className='menupage-food-card-name'>
                        {meal.mealName}
                      </h3>
                      <span className='menupage-food-card-category-tag'>
                        {/* meal.categoryName api den geliyor olmalı, yoksa map'ten bulunur */}
                        {meal.categoryName ||
                          apiCategories.find(
                            (cat) => cat.id === meal.categoryId
                          )?.name ||
                          "Bilinmiyor"}
                      </span>
                      <div className='menupage-food-card-stock-info'>
                        <div className='menupage-food-card-stock-details'>
                          <span
                            className={`menupage-food-card-stock-badge ${
                              meal.currentStock <= (meal.maxStock || 100) * 0.2
                                ? "warning"
                                : ""
                            }`}
                          >
                            {meal.currentStock} / {meal.maxStock || 100}{" "}
                            porsiyon
                          </span>
                        </div>
                        <div className='meal-actions-wrapper'>
                          <button
                            className='meal-actions-trigger'
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(meal.id);
                            }}
                          >
                            <MoreIcon />
                          </button>

                          {openDropdownId === meal.id && (
                            <div className='meal-actions-dropdown'>
                              <div
                                className='dropdown-item'
                                onClick={() => handleDropdownEdit(meal)}
                              >
                                <EditIcon />
                                <span>Düzenle</span>
                              </div>
                              <div
                                className='dropdown-item delete'
                                onClick={() => handleDropdownDelete(meal)}
                              >
                                <DeleteIcon />
                                <span>Sil</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className='menupage-food-card-stock-bar'>
                          <div
                            className='menupage-food-card-stock-progress'
                            style={{
                              width: `${
                                (meal.currentStock / (meal.maxStock || 100)) *
                                100
                              }%`,
                              backgroundColor:
                                meal.currentStock > 25
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
      )}

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
    </>
  );
};

export default MenuPage;
