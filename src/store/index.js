import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import customerMenuReducer from "../features/customer/store/customerMenuSlice";
import restaurantMenuReducer from "../features/restaurant/store/restaurantMenuSlice";
import restaurantOrdersReducer from "../features/restaurant/store/restaurantOrdersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerMenu: customerMenuReducer,
    restaurantMenu: restaurantMenuReducer,
    restaurantOrders: restaurantOrdersReducer,
  },
});
