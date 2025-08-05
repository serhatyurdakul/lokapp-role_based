import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthLoginPage from "./features/auth/pages/Login/LoginPage.jsx";
import AuthRegisterPage from "./features/auth/pages/Register/RegisterPage.jsx";
import CustomerHomePage from "./features/customer/pages/Home/HomePage.jsx";
import CustomerProfilePage from "./features/customer/pages/Profile/ProfilePage.jsx";
import CustomerQRPage from "./features/customer/pages/QR/QRPage.jsx";
import RestaurantDashboardPage from "./features/restaurant/pages/Dashboard/DashboardPage.jsx";
import RestaurantProfilePage from "./features/restaurant/pages/Profile/ProfilePage.jsx";
import RestaurantMenuPage from "./features/restaurant/pages/Menu/MenuPage.jsx";
import RestaurantOrdersPage from "./features/restaurant/pages/Orders/OrdersPage.jsx";
import RestaurantOrderDetailPage from "./features/restaurant/pages/OrderDetail/OrderDetailPage.jsx";

import CustomerLayout from "./features/customer/layouts/CustomerLayout.jsx";
import RestaurantLayout from "./features/restaurant/layouts/RestaurantLayout.jsx";

import PrivateRoute from "./components/common/PrivateRoute/PrivateRoute.jsx";
import { verifyToken, logout } from "./features/auth/store/authSlice";

const RoleBasedLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isRestaurantEmployee === 1) {
    return <RestaurantLayout />;
  }
  return <CustomerLayout />;
};

function App() {
  const dispatch = useDispatch();
  const {
    user: userFromStore,
    token: tokenFromStore,
    isAuthenticated,
    isLoading: authIsLoading,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (tokenFromStore && !userFromStore) {
      dispatch(verifyToken());
    }
  }, [dispatch, tokenFromStore, userFromStore]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token" && event.newValue === null) {
        if (isAuthenticated) {
          dispatch(logout());
        }
      } else if (
        event.key === "token" &&
        event.oldValue &&
        event.newValue &&
        event.oldValue !== event.newValue
      ) {
        // Token changed in another tab — logout current tab for security
        if (isAuthenticated) {
          dispatch(logout());
        }
      } else if (event.key === "user" && event.newValue === null) {
        if (isAuthenticated) {
          dispatch(logout());
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, isAuthenticated, logout]);

  if (authIsLoading && tokenFromStore && !userFromStore) {
    return <div>Kimlik doğrulanıyor...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/register" element={<AuthRegisterPage />} />

        {/* Protected routes — single entry point */}
        <Route
          element={
            <PrivateRoute>
              <RoleBasedLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/"
            element={
              <RoleRenderer
                customerComponent={<CustomerHomePage />}
                restaurantComponent={<RestaurantDashboardPage />}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <RoleRenderer
                customerComponent={<CustomerProfilePage />}
                restaurantComponent={<RestaurantProfilePage />}
              />
            }
          />

          <Route
            path="/qr"
            element={
              <RoleRenderer
                customerComponent={<CustomerQRPage />}
                restaurantComponent={<Navigate to="/" replace />}
              />
            }
          />

          <Route
            path="/menu"
            element={
              <RoleRenderer
                customerComponent={<Navigate to="/" replace />}
                restaurantComponent={<RestaurantMenuPage />}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <RoleRenderer
                customerComponent={<Navigate to="/" replace />}
                restaurantComponent={<RestaurantOrdersPage />}
              />
            }
          />
          <Route
            path="/orders/:companyId"
            element={
              <RoleRenderer
                customerComponent={<Navigate to="/" replace />}
                restaurantComponent={<RestaurantOrderDetailPage />}
              />
            }
          />
        </Route>
        {/* Catch-all: redirect unmatched routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const RoleRenderer = ({ customerComponent, restaurantComponent }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>İçerik yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isRestaurantEmployee === 1) {
    return restaurantComponent;
  }
  return customerComponent;
};

export default App;
