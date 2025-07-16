import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRestaurantMeals,
  createOrder as createOrderApi,
} from "@/utils/api";

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

export const createOrder = createAsyncThunk(
  "menu/createOrder",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { user } = state.auth;
    const { selectedItems } = state.customerMenu;

    if (!user) {
      return rejectWithValue("Kullanıcı bilgileri bulunamadı.");
    }

    // Firma çalışanları için sipariş verilecek restoran ID'si 'contractedRestaurantId'dir.
    // Bu, kullanıcı rolüne göre doğru restoran ID'sini seçmemizi sağlar.
    const orderRestaurantId =
      user.isCompanyEmployee === 1
        ? user.contractedRestaurantId
        : user.restaurantId;

    if (!orderRestaurantId || !user.companyId) {
      return rejectWithValue(
        "Sipariş için gerekli restoran veya firma bilgileri eksik."
      );
    }

    const meals = Object.entries(selectedItems).map(([categoryId, mealId]) => ({
      mealId: String(mealId),
      categoryId: String(categoryId),
      quantity: "1",
    }));

    if (meals.length === 0) {
      return rejectWithValue(
        "Sipariş vermek için en az bir ürün seçmelisiniz."
      );
    }

    const orderData = {
      restaurantId: String(orderRestaurantId),
      companyId: String(user.companyId),
      meals,
    };

    try {
      const response = await createOrderApi(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Sipariş oluşturulamadı.");
    }
  }
);

const initialState = {
  categories: [],
  mealCategories: [],
  selectedItems: {},
  isLoading: false,
  error: null,
  isOrderLoading: false,
  orderError: null,
  orderSuccessMessage: null,
};

// Yemek kategorilerini işleme fonksiyonu
const processMealCategories = (mealCategories) => {
  if (
    !mealCategories ||
    !Array.isArray(mealCategories) ||
    mealCategories.length === 0
  ) {
    console.log("İşlenecek yemek kategorileri bulunamadı");
    return [];
  }

  console.log("İşlenecek yemek kategorileri:", mealCategories);

  // Her bir kategori için ayrı kategori oluşturma
  return mealCategories
    .map((category, index) => {
      // Kategori bilgilerini kontrol etme
      console.log(`İşlenen kategori ${index}:`, category);

      if (
        !category.meals ||
        !Array.isArray(category.meals) ||
        category.meals.length === 0
      ) {
        console.log(`Kategori ${index} için yemek bulunamadı`);
        return null;
      }

      // Kategori adını alma
      const categoryName = category.categoryName || `Kategori ${index + 1}`;

      // Yemekleri hazırlama
      const items = category.meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        price: parseFloat(meal.price) || 0,
        image: meal.photoUrl, // Direct usage - no transformation needed
        description: meal.description || "",
        remainingQuantity:
          meal.remainingQuantity !== undefined
            ? parseInt(meal.remainingQuantity, 10) || 0
            : 0,
      }));

      console.log(
        `Kategori ${categoryName} için ${items.length} yemek işlendi`
      );

      return {
        id: category.categoryId || index + 1,
        title: categoryName,
        items: items,
      };
    })
    .filter(Boolean); // null değerleri filtrele
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
    },
    clearOrderStatus(state) {
      state.orderError = null;
      state.orderSuccessMessage = null;
    },
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
          // Boş liste: hata değil, empty state
          state.mealCategories = [];
          state.categories = [];
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
      })
      // Sipariş oluşturma durumu
      .addCase(createOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.orderSuccessMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderSuccessMessage =
          action.payload.message || "Siparişiniz başarıyla oluşturuldu.";
        state.selectedItems = {}; // Sipariş başarılı olunca seçimleri temizle
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.payload;
        state.orderSuccessMessage = null;
      });
  },
});

export const { selectItem, clearSelection, clearOrderStatus } =
  menuSlice.actions;
export default menuSlice.reducer;
