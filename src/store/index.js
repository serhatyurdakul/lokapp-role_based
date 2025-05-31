import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import customerMenuReducer from '../features/customer/store/customerMenuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerMenu: customerMenuReducer,
  },
});
