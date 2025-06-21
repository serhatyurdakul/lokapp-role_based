import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import customerMenuReducer from "../features/customer/store/customerMenuSlice";
import restaurantMenuReducer from "../features/restaurant/store/restaurantMenuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerMenu: customerMenuReducer,
    restaurantMenu: restaurantMenuReducer,
  },
});
