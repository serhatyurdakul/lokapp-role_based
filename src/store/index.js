import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import customerMenuReducer from "../features/customer/store/customerMenuSlice";
import restaurantMenuReducer from "../features/restaurant/store/restaurantMenuSlice";
import restaurantOrdersReducer from "../features/restaurant/store/restaurantOrdersSlice";

const appReducer = combineReducers({
  auth: authReducer,
  customerMenu: customerMenuReducer,
  restaurantMenu: restaurantMenuReducer,
  restaurantOrders: restaurantOrdersReducer,
});

// rootReducer: logout olduğunda tüm store'u başlangıç hâline döndür
const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
