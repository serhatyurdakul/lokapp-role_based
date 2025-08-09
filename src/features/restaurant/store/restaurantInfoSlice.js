import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurantInfo as fetchRestaurantInfoApi } from "@/utils/api";

// Async thunk: fetch detailed restaurant info
export const fetchRestaurantInfo = createAsyncThunk(
  "restaurantInfo/fetchRestaurantInfo",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const data = await fetchRestaurantInfoApi(restaurantId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Restoran bilgileri yüklenemedi");
    }
  }
);

const initialState = {
  info: null,
  isLoading: false,
  error: null,
};

const restaurantInfoSlice = createSlice({
  name: "restaurantInfo",
  initialState,
  reducers: {
    clearRestaurantInfo(state) {
      state.info = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.info = action.payload;
      })
      .addCase(fetchRestaurantInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRestaurantInfo } = restaurantInfoSlice.actions;
export default restaurantInfoSlice.reducer;
