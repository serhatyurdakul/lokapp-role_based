import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRestaurantMeals,
  createOrder as createOrderApi,
} from "@/utils/api";

// Async thunk: fetch restaurant meals
export const fetchMeals = createAsyncThunk(
  "customerMenu/fetchMeals",
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
  "customerMenu/createOrder",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { user } = state.auth;
    const { selectedItems } = state.customerMenu;

    if (!user) {
      return rejectWithValue("Kullanıcı bilgileri bulunamadı.");
    }

    // Determine restaurantId based on role: use contractedRestaurantId for company employees

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
      quantity: "1", // Business rule: always 1 item per category
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

  selectedItems: {},
  isLoading: false,
  error: null,
  isOrderLoading: false,
  orderError: null,
  orderSuccessMessage: null,
};

// Transform API meal categories into UI-friendly structure
const processMealCategories = (mealCategories) => {
  if (
    !mealCategories ||
    !Array.isArray(mealCategories) ||
    mealCategories.length === 0
  ) {
    return [];
  }

  return mealCategories
    .map((category, index) => {
      if (
        !category.meals ||
        !Array.isArray(category.meals) ||
        category.meals.length === 0
      ) {
        return null;
      }

      const categoryName = category.categoryName || `Kategori ${index + 1}`;

      const items = category.meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        price: parseFloat(meal.price) || 0,
        image: meal.photoUrl,
        description: meal.description || "",
        remainingQuantity:
          meal.remainingQuantity !== undefined
            ? parseInt(meal.remainingQuantity, 10) || 0
            : 0,
      }));

      return {
        id: category.categoryId || index + 1,
        title: categoryName,
        items: items,
      };
    })
    .filter(Boolean);
};

const menuSlice = createSlice({
  name: "customerMenu",
  initialState,
  reducers: {
    selectItem(state, action) {
      const { categoryId, itemId } = action.payload;

      if (state.selectedItems[categoryId] === itemId) {
        delete state.selectedItems[categoryId];
      } else {
        state.selectedItems[categoryId] = itemId;
      }
    },

    clearOrderStatus(state) {
      state.orderError = null;
      state.orderSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch meals – pending
      .addCase(fetchMeals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.isLoading = false;

        // Handle empty or invalid payload
        if (
          !action.payload ||
          !Array.isArray(action.payload) ||
          action.payload.length === 0
        ) {
          // Empty list is not an error; show empty state
          state.categories = [];
          return;
        }

        state.categories = processMealCategories(action.payload);
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Preserve previous menu so the user can keep existing selections
        console.error("Yemekler yüklenemedi:", action.payload);
      })
      // Create order – pending
      .addCase(createOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.orderSuccessMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderSuccessMessage =
          action.payload.message || "Order created successfully.";
        state.selectedItems = {}; // Clear selection after successful order
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.payload;
        state.orderSuccessMessage = null;
      });
  },
});

export const { selectItem, clearOrderStatus } = menuSlice.actions;
export default menuSlice.reducer;
