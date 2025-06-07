import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./MenuPage.scss";
import FilterBar from "@/components/common/FilterBar/FilterBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { ReactComponent as AddIcon } from "@/assets/icons/add.svg";
import Button from "@/components/common/Button/Button";
import AddMealModal from "../../components/AddMealModal/AddMealModal";
import {
  fetchMealCategories,
  fetchRestaurantMenu,
} from "@/utils/api";

const sortMenuData = (menuDataToSort) => {
  if (!menuDataToSort || menuDataToSort.length === 0) {
    return [];
  }

  // Orijinal veriyi değiştirmemek için derin kopya alma
  // JSON.parse(JSON.stringify(obj)) basit objeler ve diziler için çalışır,
  // ancak Date objelerini string'e çevirir. Bu yüzden sıralama içinde new Date() kullanılıyor
  const sortedData = JSON.parse(JSON.stringify(menuDataToSort));

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

const MenuPage = () => {
  // Redux state inden kullanıcı bilgilerini alma
  const { user } = useSelector((state) => state.auth);
  const restaurantId = user?.restaurantId; // Opsiyonel zincirleme

  // api den gelen kategoriler (modal için)
  const [apiCategories, setApiCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // api den gelen restoran menü verisi (kategorilere göre gruplu)
  const [restaurantMenuData, setRestaurantMenuData] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  // sayfada gösterilecek ana yemek listesi (düz liste)
  const [menuMeals, setMenuMeals] = useState([]);

// FilterBar için kategoriler (menuMeals dan türetilecek)
const [categoriesForFilterBar, setCategoriesForFilterBar] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [lastSelectedCategory, setLastSelectedCategory] = useState("");

  // Yemek kategorilerini çekme (Modal için)
  useEffect(() => {
    const loadMealCategories = async () => {
      setIsLoadingCategories(true);
      const categoriesData = await fetchMealCategories();
      setApiCategories(categoriesData || []);
      setIsLoadingCategories(false);
    };
    loadMealCategories();
  }, []);

  // Restoran menüsünü çekip sıralama
  useEffect(() => {
    if (restaurantId) {
      loadRestaurantMenu();
    }
  }, [restaurantId]);

  const loadRestaurantMenu = async () => {
    setIsLoadingMenu(true);
    const rawMenuData = await fetchRestaurantMenu(restaurantId);
    const sortedMenuData = sortMenuData(rawMenuData);
    setRestaurantMenuData(sortedMenuData || []);
    setIsLoadingMenu(false);
  };

  // restaurantMenuData değiştiğinde menuMeals ve FilterBar kategorilerini güncelleme
  useEffect(() => {
    if (restaurantMenuData && restaurantMenuData.length > 0) {
      const allMeals = restaurantMenuData.reduce((acc, categoryGroup) => {
        const mealsWithCategory = categoryGroup.meals.map((meal) => ({
          ...meal,
          currentStock: meal.quantity,
          maxStock: meal.maxStock || 100,
          mealName: meal.name,
          imageUrl: meal.imageUrl,
        }));
        return acc.concat(mealsWithCategory);
      }, []);
      setMenuMeals(allMeals);

      const uniqueCategoriesForFilter = restaurantMenuData.map(
        (categoryGroup) => ({
          id: categoryGroup.categoryId,
          name: categoryGroup.categoryName,
        })
      );
      const uniqueIds = new Set();
      const finalCategoriesForFilter = uniqueCategoriesForFilter.filter(
        (cat) => {
          if (!uniqueIds.has(cat.id)) {
            uniqueIds.add(cat.id);
            return true;
          }
          return false;
        }
      );
      setCategoriesForFilterBar(finalCategoriesForFilter);
    } else {
      setMenuMeals([]);
      setCategoriesForFilterBar([]);
    }
  }, [restaurantMenuData]);

  // Kategori değişimi (FilterBar için)
  const handleCategoryChange = (categoryValue) => {
    // Gelen değeri ve tipini loglama
    console.log(
      "FilterBar onCategoryChange. typeof categoryValue:",
      typeof categoryValue,
      "Value:",
      categoryValue
    );

    let newSelectedCategory = categoryValue;
    if (categoryValue !== "all" && typeof categoryValue === "string") {
      const parsedId = parseInt(categoryValue, 10);
      if (!isNaN(parsedId)) {
        newSelectedCategory = parsedId;
      } else {
        // Eğer parse edilemezse veya NaN dönerse, bir hata durumu oluşmuş demektir.
        // Bu durumda belki de 'all' kategorisine geri dönmek daha güvenli olabilir.
        console.error(
          `FilterBar'dan geçersiz kategori ID'si geldi: ${categoryValue}. 'all' kategorisine dönülüyor.`
        );
        newSelectedCategory = "all";
      }
    }
    // selectedCategory state ine atanacak son değeri loglama
    console.log(
      "Setting selectedCategory to. typeof newSelectedCategory:",
      typeof newSelectedCategory,
      "Value:",
      newSelectedCategory
    );
    setSelectedCategory(newSelectedCategory);
  };

  const openAddMealModal = () => {
    setShowAddMealModal(true);
  };

  const closeAddMealModal = () => {
    setShowAddMealModal(false);
  };

  const handleMealAdded = async () => {
    await loadRestaurantMenu();
    window.scrollTo(0, 0); // Sayfanın en üstüne scroll et
  };

  const handleEdit = (meal) => {
    console.log("Düzenle tıklandı", meal);
  };

  const filteredMeals =
    selectedCategory === "all"
      ? menuMeals
      : menuMeals.filter((meal) => meal.categoryId === selectedCategory);

  // Kategori bazlı gruplama fonksiyonu -  filteredMeals ve apiCategories/categoriesForFilterBar kullanılarak
  const groupMealsByCategoryForDisplay = (mealsToGroup) => {
    if (!mealsToGroup || mealsToGroup.length === 0) return {};

    // Kategori isimlerini ID lere mapleyen bir obje oluşturma 
    const categoryIdToNameMap = (
      apiCategories.length > 0 ? apiCategories : categoriesForFilterBar
    ).reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});

    return mealsToGroup.reduce((groups, meal) => {
      // meal.categoryId sayısal olmalı, meal.categoryName de api den geliyor olabilir
      const categoryName =
        meal.categoryName || categoryIdToNameMap[meal.categoryId] || "Diğer";
      (groups[categoryName] = groups[categoryName] || []).push(meal);
      return groups;
    }, {});
  };

  // Gösterim için gruplanmış meal'lar
  // Eğer belirli bir kategori seçiliyse, sadece o kategorinin yemekleri zaten filteredMeals'da olacak.
  // Bu durumda gruplamaya gerek kalmayabilir veya grup başlığı için selectedCategory'nin adı bulunabilir.
  // Eğer "all" seçiliyse, filteredMeals (yani tüm menuMeals) gruplanır.
  let mealsForDisplay;
  let singleCategoryNameForDisplay = null;

  if (selectedCategory === "all") {
    mealsForDisplay = groupMealsByCategoryForDisplay(menuMeals); // Tüm menüyü grupla
  } else {
    // Sadece seçili kategorinin yemekleri (filteredMeals içinde) ve bu kategorinin adını alalım.
    const categoryName =
      categoriesForFilterBar.find((cat) => cat.id === selectedCategory)?.name ||
      apiCategories.find((cat) => cat.id === selectedCategory)?.name ||
      "Seçili Kategori";
    singleCategoryNameForDisplay = categoryName;
    mealsForDisplay = { [categoryName]: filteredMeals };
  }

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

      {isLoadingMenu && <p>Menü yükleniyor...</p>}
      {!isLoadingMenu &&
        Object.keys(mealsForDisplay).length === 0 &&
        menuMeals.length === 0 && (
          // Hiç ürün yoksa (api den hiç gelmediyse)
          <div className='empty-menu-message'>
            <p>Menüde henüz hiç yemek bulunmuyor. Hemen ekleyin!</p>
          </div>
        )}
      {!isLoadingMenu &&
        Object.keys(mealsForDisplay).length === 0 &&
        menuMeals.length > 0 &&
        selectedCategory !== "all" && (
          // Belirli bir kategori seçili ama o kategoride ürün yoksa
          <div className='empty-menu-message'>
            <p>Bu kategoride henüz yemek bulunmuyor.</p>
          </div>
        )}

      {!isLoadingMenu && Object.keys(mealsForDisplay).length > 0 && (
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
                      <h3 className='menupage-food-card-name'>{meal.mealName}</h3>
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
                            {meal.currentStock} / {meal.maxStock || 100} porsiyon
                          </span>
                        </div>
                        <Button
                          variant='secondary'
                          onClick={() => handleEdit(meal)}
                          disabled={false}
                        >
                          Düzenle
                        </Button>
                        <div className='menupage-food-card-stock-bar'>
                          <div
                            className='menupage-food-card-stock-progress'
                            style={{
                              width: `${
                                (meal.currentStock / (meal.maxStock || 100)) * 100
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
        initialCategoryId={lastSelectedCategory}
        onMealAdded={handleMealAdded}
        isLoadingCategories={isLoadingCategories}
      />
    </>
  );
};

export default MenuPage;
