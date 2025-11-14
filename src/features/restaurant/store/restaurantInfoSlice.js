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
    setOrderCutoffTime(state, action) {
      const cutoffTime = action.payload;
      if (!state.info) {
        state.info = {};
      }
      state.info.orderCutoffTime = cutoffTime;
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

export const { clearRestaurantInfo, setOrderCutoffTime } = restaurantInfoSlice.actions;
export default restaurantInfoSlice.reducer;
