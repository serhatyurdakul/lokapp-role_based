import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { fetchMealCategories, fetchRestaurantMenu } from "@/utils/api";

// Thunk: fetch meal categories
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

// Thunk: fetch restaurant menu
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
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

      // Fetch menu data
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

export const { setLastAddedCategory } = restaurantMenuSlice.actions;
export default restaurantMenuSlice.reducer;

/* ---------- Selectors & Derived Helpers ---------- */

// Sort menu data (newest meals first)
const sortMenuData = (menuData) => {
  if (!menuData || menuData.length === 0) return [];

  // Shallow copy to avoid mutating references
  const sorted = menuData.map((categoryGroup) => ({
    ...categoryGroup,
    meals: (categoryGroup.meals || []).map((meal) => ({ ...meal })),
  }));

  sorted.forEach((categoryGroup) => {
    if (categoryGroup.meals?.length) {
      categoryGroup.meals.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      categoryGroup.latestMealCreatedAt = categoryGroup.meals[0].createdAt;
    } else {
      categoryGroup.latestMealCreatedAt = "1970-01-01T00:00:00Z";
    }
  });

  // Sort categories by latest meal date
  sorted.sort(
    (a, b) => new Date(b.latestMealCreatedAt) - new Date(a.latestMealCreatedAt)
  );

  return sorted;
};

const selectMenuData = (state) => state.restaurantMenu.menuData;

// Flattened meals list and categories for FilterBar
export const selectMenuMealsAndCategories = createSelector(
  [selectMenuData],
  (menuData) => {
    const sortedMenuData = sortMenuData(menuData);

    const menuMeals = sortedMenuData.flatMap((categoryGroup) =>
      (categoryGroup.meals || []).map((meal) => ({
        ...meal,
        currentStock: meal.remainingQuantity,
        mealName: meal.name,
        imageUrl: meal.photoUrl,
      }))
    );

    const categoriesForFilterBar = [
      ...new Map(
        sortedMenuData.map((item) => [
          item.categoryId,
          { id: String(item.categoryId), name: item.categoryName },
        ])
      ).values(),
    ];

    return { menuMeals, categoriesForFilterBar };
  }
);
