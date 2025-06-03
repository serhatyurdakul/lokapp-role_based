import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./MenuPage.scss";
import FilterBar from "@/components/common/FilterBar/FilterBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { ReactComponent as AddIcon } from "@/assets/icons/add.svg";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import FormSelect from "@/components/common/forms/FormSelect/FormSelect";
import Button from "@/components/common/Button/Button";
import GenericModal from "@/components/common/GenericModal/GenericModal";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import {
  fetchMealCategories,
  fetchMealTemplatesByCategory,
  fetchRestaurantMenu,
  addRestaurantMeal,
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

  // api den gelen yemek şablonları (modalda yemek adı arama için)
  const [mealTemplates, setMealTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // sayfada gösterilecek ana yemek listesi (düz liste)
  const [menuItems, setMenuItems] = useState([]);

  // FilterBar için kategoriler (menuItems dan türetilecek)
  const [categoriesForFilterBar, setCategoriesForFilterBar] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef(null);
  const [selectedCategoryInModal, setSelectedCategoryInModal] = useState("");
  const [currentFoodStock, setCurrentFoodStock] = useState("");
  const [lastSelectedCategory, setLastSelectedCategory] = useState("");
  const [selectedMealTemplateInfo, setSelectedMealTemplateInfo] =
    useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredMealTemplates, setFilteredMealTemplates] = useState([]);
  const [mealExistsError, setMealExistsError] = useState("");

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
      const loadAndProcessRestaurantMenu = async () => {
        setIsLoadingMenu(true);
        const rawMenuData = await fetchRestaurantMenu(restaurantId);
        const sortedMenuData = sortMenuData(rawMenuData);
        setRestaurantMenuData(sortedMenuData || []);
        setIsLoadingMenu(false);
      };
      loadAndProcessRestaurantMenu();
    }
  }, [restaurantId]);

  // restaurantMenuData değiştiğinde menuItems ı ve FilterBar kategorilerini güncelleme
  useEffect(() => {
    if (restaurantMenuData && restaurantMenuData.length > 0) {
      const allMeals = restaurantMenuData.reduce((acc, categoryGroup) => {
        const mealsWithCategory = categoryGroup.meals.map((meal) => ({
          ...meal,
          stock: meal.quantity,
          maxStock: meal.maxStock || 100,
          image: meal.imageUrl,
        }));
        return acc.concat(mealsWithCategory);
      }, []);
      setMenuItems(allMeals);

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
      setMenuItems([]);
      setCategoriesForFilterBar([]);
    }
  }, [restaurantMenuData]);

  // Modal açıkken ve apiCategories yüklendiğinde, eğer modalda kategori seçilmemişse ilkini seçme
  useEffect(() => {
    if (
      showAddForm &&
      !selectedCategoryInModal &&
      apiCategories.length > 0 &&
      apiCategories[0]?.id
    ) {
      setSelectedCategoryInModal(apiCategories[0].id);
      // Eğer kullanıcı daha önce hiç seçim yapmadıysa (lastSelectedCategory boşsa)
      // ve biz programatik olarak ilkini seçiyorsak, bunu son seçim olarak da kaydedebiliriz.
      if (!lastSelectedCategory) {
        setLastSelectedCategory(apiCategories[0].id);
      }
    }
  }, [
    showAddForm,
    apiCategories,
    selectedCategoryInModal,
    lastSelectedCategory,
  ]);

  // Modal'da kategori seçildiğinde yemek şablonlarını çekme
  useEffect(() => {
    if (
      selectedCategoryInModal &&
      typeof selectedCategoryInModal === "number"
    ) {
      const loadMealTemplates = async () => {
        setIsLoadingTemplates(true);
        const templatesData = await fetchMealTemplatesByCategory(
          selectedCategoryInModal
        );
        setMealTemplates(templatesData || []);
        setFilteredMealTemplates([]);
        setIsLoadingTemplates(false);
      };
      loadMealTemplates();
    } else {
      setMealTemplates([]);
      setFilteredMealTemplates([]);
    }
  }, [selectedCategoryInModal]);

  // Arama işlevi (Yemek Adı - Modal)
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedMealTemplateInfo(null);

    if (query.length >= 1 && mealTemplates.length > 0) {
      const filtered = mealTemplates.filter((template) =>
        template.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMealTemplates(filtered);
      setShowSearchResults(filtered.length > 0);
    } else {
      setFilteredMealTemplates([]);
      setShowSearchResults(false);
    }
  };

  // Arama sonuçlarından yemek seçme işlevi
  const handleSelectFood = (foodTemplate) => {
    setSearchQuery(foodTemplate.name);
    setSelectedMealTemplateInfo({
      id: foodTemplate.id,
      name: foodTemplate.name,
    });
    setShowSearchResults(false);
  };

  // Arama sonuçları listesi dışına tıklandığında listeyi gizleme işlevi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Yemek adı input unu temizleme fonksiyonu (Modal)
  const handleClearFoodNameSearch = () => {
    setSearchQuery("");
    setSelectedMealTemplateInfo(null);
    setFilteredMealTemplates([]);
    setShowSearchResults(false);
  };

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

  // Form state lerini resetleme yardımcı fonksiyonu
  const resetFormStates = () => {
    setSearchQuery("");
    setCurrentFoodStock("");
    setShowSearchResults(false);
    setSelectedMealTemplateInfo(null);
    setFilteredMealTemplates([]);
    setMealExistsError("");
  };

  // Modal daki kategori değişimini izleme ve arama sonuçlarını resetleme
  const handleModalCategoryChange = (e) => {
    const newCategoryIdString = e.target.value;
    const newCategoryId = newCategoryIdString
      ? parseInt(newCategoryIdString, 10)
      : "";

    setSelectedCategoryInModal(newCategoryId);
    setLastSelectedCategory(newCategoryId);
    setSearchQuery("");
    setMealTemplates([]);
    setShowSearchResults(false);
    setSelectedMealTemplateInfo(null);
    setFilteredMealTemplates([]);
    setMealExistsError("");
  };

  const handleAddNew = () => {
    resetFormStates();
    setEditingItem(null);
    setShowAddForm(true);

    if (lastSelectedCategory && typeof lastSelectedCategory === "number") {
      setSelectedCategoryInModal(lastSelectedCategory);
    } else if (apiCategories.length > 0 && apiCategories[0]?.id) {
      setSelectedCategoryInModal(apiCategories[0].id);
      // Yeni ekleme sırasında ilk kategoriyi son seçilen yapalım, böylece bir sonraki açılışta hatırlanır.
      setLastSelectedCategory(apiCategories[0].id);
    } else {
      setSelectedCategoryInModal("");
    }
  };

  const handleCloseModal = () => {
    resetFormStates();
    setEditingItem(null);
    setShowAddForm(false);
    setSelectedCategoryInModal("");
    setMealExistsError("");
  };

  const handleEdit = (item) => {
    resetFormStates();
    setEditingItem(item);
    setShowAddForm(true);
    setSelectedCategoryInModal(item.categoryId || "");
    setLastSelectedCategory(item.categoryId || "");
    setSearchQuery(item.name || "");
    setSelectedMealTemplateInfo(null);
    setCurrentFoodStock(item.stock?.toString() || "");
  };

  const handleSubmitFoodForm = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setMealExistsError("");

    if (editingItem) {
      console.log("Yemek güncelleniyor (API yok):", editingItem.id, {
        name: searchQuery,
        category: selectedCategoryInModal,
        stock: parseInt(currentFoodStock, 10) || 0,
      });
      handleCloseModal();
      return;
    }

    if (!selectedMealTemplateInfo || !selectedMealTemplateInfo.id) {
      console.error("Lütfen bir yemek adı seçin.");
      // TODO: Kullanıcıya bildirim göster (örn: toast)
      return;
    }

    const stockValue = parseInt(currentFoodStock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      console.error("Geçerli bir stok miktarı girin.");
      // TODO: Kullanıcıya bildirim göster
      return;
    }

    if (!restaurantId) {
      console.error("Restoran ID bulunamadı. Kullanıcı girişi kontrol edin.");
      return;
    }

    const mealToAdd = {
      mealMenuId: selectedMealTemplateInfo.id.toString(),
      quantity: stockValue.toString(),
      restaurantId: restaurantId.toString(),
    };

    setIsSubmitting(true);
    try {
      const response = await addRestaurantMeal(mealToAdd);
      if (response && !response.error) {
        console.log("Yemek başarıyla eklendi:", response.message);
        // Başarılı: Menüyü yenile ve sırala
        const newRawMenuData = await fetchRestaurantMenu(restaurantId);
        const newSortedMenuData = sortMenuData(newRawMenuData);
        setRestaurantMenuData(newSortedMenuData || []);
        handleCloseModal();
        window.scrollTo(0, 0); // Sayfanın en üstüne scroll et
        // TODO: Kullanıcıya başarı bildirimi göster (örn: "Yemek başarıyla eklendi!")
      } else {
        if (
          response &&
          response.error &&
          response.message &&
          response.message.includes("Bu yemek günlük menüde bulunmaktadır")
        ) {
          setMealExistsError(response.message);
        } else {
          console.error(
            "Yemek ekleme başarısız:",
            response?.message || "Bilinmeyen bir hata oluştu."
          );
          setMealExistsError(
            response?.message ||
              "Yemek eklenirken bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      }
    } catch (error) {
      console.error(
        "Yemek ekleme API çağrısı sırasında bir hata oluştu:",
        error
      );
      setMealExistsError(
        "Sunucuyla iletişim kurulamadı. Lütfen tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.categoryId === selectedCategory);

  // Kategori bazlı gruplama fonksiyonu -  filteredItems ve apiCategories/categoriesForFilterBar kullanılarak
  const groupItemsByCategoryForDisplay = (itemsToGroup) => {
    if (!itemsToGroup || itemsToGroup.length === 0) return {};

    // Kategori isimlerini ID lere mapleyen bir obje oluşturma 
    const categoryIdToNameMap = (
      apiCategories.length > 0 ? apiCategories : categoriesForFilterBar
    ).reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});

    return itemsToGroup.reduce((groups, item) => {
      // item.categoryId sayısal olmalı, item.categoryName de api den geliyor olabilir
      const categoryName =
        item.categoryName || categoryIdToNameMap[item.categoryId] || "Diğer";
      (groups[categoryName] = groups[categoryName] || []).push(item);
      return groups;
    }, {});
  };

  // Gösterim için gruplanmış item'lar
  // Eğer belirli bir kategori seçiliyse, sadece o kategorinin yemekleri zaten filteredItems'da olacak.
  // Bu durumda gruplamaya gerek kalmayabilir veya grup başlığı için selectedCategory'nin adı bulunabilir.
  // Eğer "all" seçiliyse, filteredItems (yani tüm menuItems) gruplanır.
  let itemsForDisplay;
  let singleCategoryNameForDisplay = null;

  if (selectedCategory === "all") {
    itemsForDisplay = groupItemsByCategoryForDisplay(menuItems); // Tüm menüyü grupla
  } else {
    // Sadece seçili kategorinin yemekleri (filteredItems içinde) ve bu kategorinin adını alalım.
    const categoryName =
      categoriesForFilterBar.find((cat) => cat.id === selectedCategory)?.name ||
      apiCategories.find((cat) => cat.id === selectedCategory)?.name ||
      "Seçili Kategori";
    singleCategoryNameForDisplay = categoryName;
    itemsForDisplay = { [categoryName]: filteredItems };
  }

  // Modal butonunun disabled durumunu belirlemek için değişkenler
  const stockValue = Number(currentFoodStock);
  const isStockInvalid =
    currentFoodStock.trim() === "" || isNaN(stockValue) || stockValue <= 0;

  let isButtonDisabledDueToFields = false;
  if (editingItem) {
    isButtonDisabledDueToFields = !searchQuery.trim() || isStockInvalid;
  } else {
    isButtonDisabledDueToFields = !selectedMealTemplateInfo || isStockInvalid;
  }
  const finalIsPrimaryButtonDisabled =
    isSubmitting || isButtonDisabledDueToFields;

  return (
    <>
      <PageHeader title='Menü Yönetimi'>
        <button
          className={`add-button ${showAddForm ? "disabled" : ""}`}
          onClick={handleAddNew}
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
        Object.keys(itemsForDisplay).length === 0 &&
        menuItems.length === 0 && (
          // Hiç ürün yoksa (api den hiç gelmediyse)
          <div className='empty-menu-message'>
            <p>Menüde henüz hiç yemek bulunmuyor. Hemen ekleyin!</p>
          </div>
        )}
      {!isLoadingMenu &&
        Object.keys(itemsForDisplay).length === 0 &&
        menuItems.length > 0 &&
        selectedCategory !== "all" && (
          // Belirli bir kategori seçili ama o kategoride ürün yoksa
          <div className='empty-menu-message'>
            <p>Bu kategoride henüz yemek bulunmuyor.</p>
          </div>
        )}

      {!isLoadingMenu && Object.keys(itemsForDisplay).length > 0 && (
        <div className='menupage-items-by-category'>
          {Object.entries(itemsForDisplay).map(([categoryName, items]) => (
            <div key={categoryName} className='menupage-category-section'>
              <h3 className='menupage-category-title'>{categoryName}</h3>
              <div className='menupage-category-grid'>
                {items.map((item) => (
                  <div key={item.id} className='menupage-food-card'>
                    <div className='menupage-food-card-image'>
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                      />
                    </div>
                    <div className='menupage-food-card-content'>
                      <h3 className='menupage-food-card-name'>{item.name}</h3>
                      <span className='menupage-food-card-category-tag'>
                        {/* item.categoryName api den geliyor olmalı, yoksa map'ten bulunur */}
                        {item.categoryName ||
                          apiCategories.find(
                            (cat) => cat.id === item.categoryId
                          )?.name ||
                          "Bilinmiyor"}
                      </span>
                      <div className='menupage-food-card-stock-info'>
                        <div className='menupage-food-card-stock-details'>
                          <span
                            className={`menupage-food-card-stock-badge ${
                              item.stock <= (item.maxStock || 100) * 0.2
                                ? "warning"
                                : ""
                            }`}
                          >
                            {item.stock} / {item.maxStock || 100} porsiyon
                          </span>
                        </div>
                        <Button
                          variant='secondary'
                          onClick={() => handleEdit(item)}
                          disabled={isSubmitting}
                        >
                          Düzenle
                        </Button>
                        <div className='menupage-food-card-stock-bar'>
                          <div
                            className='menupage-food-card-stock-progress'
                            style={{
                              width: `${
                                (item.stock / (item.maxStock || 100)) * 100
                              }%`,
                              backgroundColor:
                                item.stock > 25
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


      {showAddForm && (
        <GenericModal
          isOpen={showAddForm}
          onClose={!isSubmitting ? handleCloseModal : () => {}}
          title={editingItem ? "Yemek Düzenle" : "Yeni Yemek Ekle"}
          primaryButtonText={
            editingItem
              ? isSubmitting
                ? "Güncelleniyor..."
                : "Güncelle"
              : isSubmitting
              ? "Ekleniyor..."
              : "Ekle"
          }
          onPrimaryAction={handleSubmitFoodForm}
          secondaryButtonText='İptal'
          isPrimaryButtonDisabled={finalIsPrimaryButtonDisabled}
          primaryButtonLoading={isSubmitting}
        >
          <form className='menu-form'>
            <ErrorMessage message={mealExistsError} />
            <FormSelect
              label='Kategori'
              id='category-modal-select'
              name='category'
              value={selectedCategoryInModal}
              onChange={handleModalCategoryChange}
              options={apiCategories.map((category) => ({
                id: category.id,
                name: category.name,
              }))}
              defaultOptionText={
                isLoadingCategories ? "Kategoriler Yükleniyor..." : null
              }
              required
              disabled={isLoadingCategories}
            />

            <div className='search-input-container'>
              <FormInput
                label='Yemek Adı'
                id='name-modal-input'
                name='name'
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Yemek adını yazarak arayın'
                autoComplete='off'
                required
                isClearable={true}
                onClear={handleClearFoodNameSearch}
              />
              {isLoadingTemplates && (
                <div className='search-loading'>Yemekler yükleniyor...</div>
              )}
              {!isLoadingTemplates &&
                showSearchResults &&
                filteredMealTemplates.length > 0 && (
                  <div className='search-results' ref={searchResultsRef}>
                    {filteredMealTemplates.map((foodTemplate) => (
                      <div
                        key={foodTemplate.id || foodTemplate.name}
                        className='search-result-item'
                        onClick={() => handleSelectFood(foodTemplate)}
                      >
                        {foodTemplate.name}
                      </div>
                    ))}
                  </div>
                )}
              {!isLoadingTemplates &&
                showSearchResults &&
                searchQuery.length > 0 &&
                filteredMealTemplates.length === 0 && (
                  <div className='search-no-results'>
                    "{searchQuery}" ile eşleşen yemek bulunamadı.
                  </div>
                )}
            </div>

            <FormInput
              label='Stok Miktarı'
              id='stock-modal-input'
              name='stock'
              type='number'
              value={currentFoodStock}
              onChange={(e) => setCurrentFoodStock(e.target.value)}
              placeholder='Stok miktarını girin'
              min='0'
              required
              isClearable={true}
              onClear={() => setCurrentFoodStock("")}
            />
          </form>
        </GenericModal>
      )}
    </>
  );
};

export default MenuPage;
