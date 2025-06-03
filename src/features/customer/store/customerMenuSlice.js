import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurantMeals } from "@/utils/api";

// Thunk - restoran yemeklerini api'den getirme
export const fetchMeals = createAsyncThunk(
  "menu/fetchMeals",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const mealCategories = await fetchRestaurantMeals(restaurantId);
      return mealCategories;
    } catch (error) {
      return rejectWithValue(error.message || "Yemekler yüklenemedi");
    }
  }
);

const initialState = {
  categories: [],
  mealCategories: [],
  selectedItems: {},
  isLoading: false,
  error: null
};

// Resim url sini düzeltme fonksiyonu
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://placehold.co/150x150?text=Yemek";
  
  // Eğer url göreli ise tam url ye çevir
  if (imageUrl.startsWith("/")) {
    return `https://emreustaa.com${imageUrl}`;
  }
  
  return imageUrl;
};

// Yemek kategorilerini işleme fonksiyonu
const processMealCategories = (mealCategories) => {
  if (!mealCategories || !Array.isArray(mealCategories) || mealCategories.length === 0) {
    console.log("İşlenecek yemek kategorileri bulunamadı");
    return [];
  }
  
  console.log("İşlenecek yemek kategorileri:", mealCategories);
  
  // Her bir kategori için ayrı kategori oluşturma
  return mealCategories.map((category, index) => {
    // Kategori bilgilerini kontrol etme
    console.log(`İşlenen kategori ${index}:`, category);
    
    if (!category.meals || !Array.isArray(category.meals) || category.meals.length === 0) {
      console.log(`Kategori ${index} için yemek bulunamadı`);
      return null;
    }
    
    // Kategori adını alma
    const categoryName = category.categoryName || `Kategori ${index + 1}`;
    
    // Yemekleri hazırlama
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
      
      // Eğer aynı ürün seçili ise, seçimi kaldırma (toggle)
      if (state.selectedItems[categoryId] === itemId) {
        delete state.selectedItems[categoryId];
      } else {
        // Değilse yeni seçimi yapma
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
        
        // Gelen veri null veya boş mu kontrolü yapma
        if (!action.payload || !Array.isArray(action.payload) || action.payload.length === 0) {
          state.mealCategories = [];
          state.categories = [];
          state.error = "Yemek verisi bulunamadı.";
          return;
        }
        
        state.mealCategories = action.payload;
        
        // Yemek kategorilerini işleme
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
