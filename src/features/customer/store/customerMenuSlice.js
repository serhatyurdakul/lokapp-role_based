import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurantMeals } from "@/utils/api";

// Thunk - Restoran yemeklerini API'den getirme
export const fetchMeals = createAsyncThunk(
  "menu/fetchMeals",
  async (restaurantId, { rejectWithValue }) => {
    try {
      // API'den yemekleri getir
      const mealCategories = await fetchRestaurantMeals(restaurantId);
      return mealCategories;
    } catch (error) {
      return rejectWithValue(error.message || "Yemekler yüklenemedi");
    }
  }
);

const initialState = {
  // Başlangıçta boş kategoriler
  categories: [],
  // API'den yüklenen ham yemek verileri
  mealCategories: [],
  selectedItems: {},
  isLoading: false,
  error: null
};

// Resim URL'sini düzeltme fonksiyonu
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://placehold.co/150x150?text=Yemek";
  
  // Eğer URL göreli ise tam URL'ye çevir
  if (imageUrl.startsWith("/")) {
    return `https://emreustaa.com${imageUrl}`;
  }
  
  return imageUrl;
};

// Yemek kategorilerini işleyen fonksiyon
const processMealCategories = (mealCategories) => {
  if (!mealCategories || !Array.isArray(mealCategories) || mealCategories.length === 0) {
    console.log("İşlenecek yemek kategorileri bulunamadı");
    return [];
  }
  
  console.log("İşlenecek yemek kategorileri:", mealCategories);
  
  // Her bir kategori için ayrı kategori oluştur
  return mealCategories.map((category, index) => {
    // Kategori bilgilerini kontrol et
    console.log(`İşlenen kategori ${index}:`, category);
    
    if (!category.meals || !Array.isArray(category.meals) || category.meals.length === 0) {
      console.log(`Kategori ${index} için yemek bulunamadı`);
      return null;
    }
    
    // Kategori adı
    const categoryName = category.categoryName || `Kategori ${index + 1}`;
    
    // Yemekleri hazırla
    const items = category.meals.map(meal => ({
      id: meal.id,
      name: meal.name,
      price: parseFloat(meal.price) || 0,
      image: getValidImageUrl(meal.imageUrl),
      description: meal.description || ""
    }));
    
    console.log(`Kategori ${categoryName} için ${items.length} yemek işlendi`);
    
    return {
      id: category.categoryId || index + 1,
      title: categoryName,
      items: items
    };
  }).filter(Boolean); // null değerleri filtrele
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Yemek seçme/güncelleme
    selectItem(state, action) {
      const { categoryId, itemId } = action.payload;
      
      // Eğer aynı ürün seçili ise, seçimi kaldır (toggle)
      if (state.selectedItems[categoryId] === itemId) {
        delete state.selectedItems[categoryId];
      } else {
        // Değilse yeni seçimi yap
        state.selectedItems[categoryId] = itemId;
      }
    },
    // Seçimi temizleme
    clearSelection(state) {
      state.selectedItems = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Yemekleri getirme durumu
      .addCase(fetchMeals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("fetchMeals.fulfilled - Payload:", action.payload);
        
        // Gelen veri null veya boşsa, kontrolle işlem yap
        if (!action.payload || !Array.isArray(action.payload) || action.payload.length === 0) {
          state.mealCategories = [];
          state.categories = [];
          state.error = "Yemek verisi bulunamadı.";
          return;
        }
        
        state.mealCategories = action.payload;
        
        // Yemek kategorilerini işle
        state.categories = processMealCategories(state.mealCategories);
        console.log("Kategoriler oluşturuldu:", state.categories);
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("Yemekler yüklenemedi:", action.payload);
      });
  }
});

export const { selectItem, clearSelection } = menuSlice.actions;
export default menuSlice.reducer;
