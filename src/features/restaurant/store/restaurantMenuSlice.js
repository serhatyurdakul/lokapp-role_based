import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMealCategories, fetchRestaurantMenu } from "@/utils/api";

// Thunk - restoran kategorilerini getirme
export const fetchRestaurantCategories = createAsyncThunk(
  "restaurantMenu/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchMealCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message || "Kategoriler yüklenemedi");
    }
  }
);

// Thunk - restoran menüsünü getirme
export const fetchRestaurantMenuData = createAsyncThunk(
  "restaurantMenu/fetchMenuData",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const menuData = await fetchRestaurantMenu(restaurantId);
      return menuData;
    } catch (error) {
      return rejectWithValue(error.message || "Menü verileri yüklenemedi");
    }
  }
);

const initialState = {
  categories: [],
  menuData: [],
  isLoading: false,
  error: null,
  lastAddedCategoryId: null,
};

const restaurantMenuSlice = createSlice({
  name: "restaurantMenu",
  initialState,
  reducers: {
    setLastAddedCategory(state, action) {
      state.lastAddedCategoryId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    resetMenuData(state) {
      state.menuData = [];
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchRestaurantCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload || [];
        state.error = null;
      })
      .addCase(fetchRestaurantCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Menu Data
      .addCase(fetchRestaurantMenuData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMenuData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuData = action.payload || [];
        state.error = null;
      })
      .addCase(fetchRestaurantMenuData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetMenuData, setLastAddedCategory } =
  restaurantMenuSlice.actions;
export default restaurantMenuSlice.reducer;
