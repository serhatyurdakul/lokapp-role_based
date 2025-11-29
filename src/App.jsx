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
import CreateOrderPage from "./features/customer/pages/CreateOrder/CreateOrderPage.jsx";
import CustomerProfilePage from "./features/customer/pages/Profile/CustomerProfilePage.jsx";
import CustomerQRPage from "./features/customer/pages/QR/QRPage.jsx";
import RestaurantDashboardPage from "./features/restaurant/pages/Dashboard/DashboardPage.jsx";
import RestaurantProfilePage from "./features/restaurant/pages/Profile/RestaurantProfilePage.jsx";
import RestaurantMenuPage from "./features/restaurant/pages/Menu/MenuPage.jsx";
import RestaurantOrdersPage from "./features/restaurant/pages/Orders/OrdersPage.jsx";
import RestaurantOrderDetailPage from "./features/restaurant/pages/OrderDetail/OrderDetailPage.jsx";
import OrderEmployeeListPage from "./features/restaurant/pages/OrderDetail/OrderEmployeeListPage.jsx";
import MenuCreatePage from "./features/restaurant/pages/Menu/MenuCreatePage.jsx";
import ReportsRedirectPage from "./features/customer/pages/Reports/ReportsRedirectPage.jsx";
import YearlyReportPage from "./features/customer/pages/Reports/YearlyReportPage.jsx";
import MonthlyReportPage from "./features/customer/pages/Reports/MonthlyReportPage.jsx";
import RestaurantReportsPage from "./features/restaurant/pages/Reports/ReportsPage.jsx";
import CompaniesPage from "./features/restaurant/pages/Companies/CompaniesPage.jsx";
import CompanyYearlyReportPage from "./features/restaurant/pages/Reports/CompanyYearlyReportPage.jsx";
import CompanyMonthlyReportPage from "./features/restaurant/pages/Reports/CompanyMonthlyReportPage.jsx";
import CompanyDailyReportPage from "./features/restaurant/pages/Reports/CompanyDailyReportPage.jsx";
import OrderCutoffSettingsPage from "./features/restaurant/pages/Settings/OrderCutoffSettingsPage.jsx";
import RestaurantQrActivityPage from "./features/restaurant/pages/QrActivity/QrActivityPage.jsx";

import CustomerLayout from "./features/customer/layouts/CustomerLayout.jsx";
import RestaurantLayout from "./features/restaurant/layouts/RestaurantLayout.jsx";

import PrivateRoute from "./common/components/PrivateRoute/PrivateRoute.jsx";
import { verifyToken, logout } from "./features/auth/store/authSlice";

const RoleBasedLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (Number(user?.isRestaurantEmployee) === 1) {
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
      } else if (event.key === "uniqueId" && event.newValue === null) {
        // uniqueId removed in another tab — logout for consistency and security
        if (isAuthenticated) {
          dispatch(logout());
        }
      } else if (
        event.key === "uniqueId" &&
        event.oldValue &&
        event.newValue &&
        event.oldValue !== event.newValue
      ) {
        // uniqueId changed in another tab — logout current tab for security
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
  }, [dispatch, isAuthenticated]);

  if (authIsLoading && tokenFromStore && !userFromStore) {
    return <div>Kimlik doğrulanıyor...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<AuthLoginPage />} />
        <Route path='/register' element={<AuthRegisterPage />} />

        {/* Protected routes — single entry point */}
        <Route
          element={
            <PrivateRoute>
              <RoleBasedLayout />
            </PrivateRoute>
          }
        >
          <Route
            path='/'
            element={
              <RoleRenderer
                customerComponent={<CustomerHomePage />}
                restaurantComponent={<RestaurantDashboardPage />}
              />
            }
          />
          <Route
            path='/orders/edit'
            element={
              <RoleRenderer
                customerComponent={<CreateOrderPage />}
                restaurantComponent={<Navigate to='/' replace />}
              />
            }
          />
          <Route
            path='/orders/new'
            element={
              <RoleRenderer
                customerComponent={<CreateOrderPage />}
                restaurantComponent={<Navigate to='/' replace />}
              />
            }
          />

          <Route
            path='/profile'
            element={
              <RoleRenderer
                customerComponent={<CustomerProfilePage />}
                restaurantComponent={<RestaurantProfilePage />}
              />
            }
          />
          <Route
            path='/settings/order-cutoff'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<OrderCutoffSettingsPage />}
              />
            }
          />

          <Route
            path='/reports'
            element={
              <RoleRenderer
                customerComponent={<ReportsRedirectPage />}
                restaurantComponent={<RestaurantReportsPage />}
              />
            }
          />

          <Route
            path='/companies'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<CompaniesPage />}
              />
            }
          />

          <Route
            path='/reports/:year'
            element={
              <RoleRenderer
                customerComponent={<YearlyReportPage />}
                restaurantComponent={<RestaurantReportsPage />}
              />
            }
          />

          <Route
            path='/reports/:year/:month'
            element={
              <RoleRenderer
                customerComponent={<MonthlyReportPage />}
                restaurantComponent={<RestaurantReportsPage />}
              />
            }
          />

          <Route
            path='/restaurant/reports/:companyId/:year'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<CompanyYearlyReportPage />}
              />
            }
          />

          <Route
            path='/restaurant/reports/:companyId/:year/:month'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<CompanyMonthlyReportPage />}
              />
            }
          />

          <Route
            path='/restaurant/reports/:companyId/:year/:month/:day'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<CompanyDailyReportPage />}
              />
            }
          />

          <Route
            path='/qr'
            element={
              <RoleRenderer
                customerComponent={<CustomerQRPage />}
                restaurantComponent={<Navigate to='/' replace />}
              />
            }
          />

          <Route
            path='/menu'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<RestaurantMenuPage />}
              />
            }
          />
          <Route
            path='/menu/new'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<MenuCreatePage />}
              />
            }
          />
          <Route
            path='/orders'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<RestaurantOrdersPage />}
              />
            }
          />
          <Route
            path='/qr-activity'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<RestaurantQrActivityPage />}
              />
            }
          />
          <Route
            path='/orders/:companyId'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<RestaurantOrderDetailPage />}
              />
            }
          />
          <Route
            path='/orders/:companyId/by-employee'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<OrderEmployeeListPage />}
              />
            }
          />
        </Route>
        {/* Catch-all: redirect unmatched routes to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
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
    return <Navigate to='/login' replace />;
  }

  if (Number(user?.isRestaurantEmployee) === 1) {
    return restaurantComponent;
  }
  return customerComponent;
};

export default App;
