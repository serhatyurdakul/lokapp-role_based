import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer, { logout } from "@/features/auth/store/authSlice";
import customerMenuReducer from "@/features/customer/store/customerMenuSlice";
import restaurantMenuReducer from "@/features/restaurant/store/restaurantMenuSlice";
import restaurantOrdersReducer from "@/features/restaurant/store/restaurantOrdersSlice";
import restaurantInfoReducer from "@/features/restaurant/store/restaurantInfoSlice";
import { setLogoutHandler } from "@/utils/api";

const appReducer = combineReducers({
  auth: authReducer,
  customerMenu: customerMenuReducer,
  restaurantMenu: restaurantMenuReducer,
  restaurantOrders: restaurantOrdersReducer,
  restaurantInfo: restaurantInfoReducer,
});

// Reset Redux state on logout (preserve cleaned auth, reset others)
const rootReducer = (state, action) => {
  if (action.type === logout.fulfilled.type) {
    const preservedAuth = state?.auth;
    state = { auth: preservedAuth };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// Inject global logout handler for API interceptors (avoids circular imports).
setLogoutHandler(() => store.dispatch(logout()));
