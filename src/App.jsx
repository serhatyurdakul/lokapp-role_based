import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Sayfa importları (Yeni adlar ve takma adlar)
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

// Layout importları (Değişiklik yok)
import CustomerLayout from "./features/customer/layouts/CustomerLayout.jsx";
import RestaurantLayout from "./features/restaurant/layouts/RestaurantLayout.jsx";

// Diğer importlar (Değişiklik yok)
import PrivateRoute from "./components/common/PrivateRoute/PrivateRoute.jsx";
import { verifyToken, logout } from "./features/auth/store/authSlice";

// Rol Bazlı Layout Seçici Bileşen (Değişiklik yok)
const RoleBasedLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Kullanıcı yoksa veya yükleniyorsa (PrivateRoute zaten bunu kontrol etmeli ama ekstra güvenlik)
    return <Navigate to='/login' replace />;
  }

  // Outlet, bu layout altındaki iç içe route'ları render edecek
  if (user.isRestaurantEmployee === 1) {
    return (
      <RestaurantLayout>
        <Outlet />
      </RestaurantLayout>
    );
  }
  return (
    <CustomerLayout>
      <Outlet />
    </CustomerLayout>
  );
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
          console.log(
            "Token localStorage'dan silindi, logout dispatch ediliyor."
          );
          dispatch(logout());
        }
      } else if (event.key === "user" && event.newValue === null) {
        if (isAuthenticated) {
          console.log(
            "User localStorage'dan silindi, logout dispatch ediliyor."
          );
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
    // Token varsa ve kullanıcı bilgisi bekleniyorsa yükleme göster
    return <div>Kimlik doğrulanıyor...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes (Yeni takma adlar) */}
        <Route path='/login' element={<AuthLoginPage />} />
        <Route path='/register' element={<AuthRegisterPage />} />

        {/* Protected Routes - Tek bir giriş noktası */}
        <Route
          element={
            <PrivateRoute>
              <RoleBasedLayout />
            </PrivateRoute>
          }
        >
          {/* Ana Sayfa (/) (Yeni takma adlar) */}
          <Route
            path='/'
            element={
              <RoleRenderer
                customerComponent={<CustomerHomePage />}
                restaurantComponent={<RestaurantDashboardPage />}
              />
            }
          />

          {/* Profil Sayfası (/profile) (Yeni takma adlar) */}
          <Route
            path='/profile'
            element={
              <RoleRenderer
                customerComponent={<CustomerProfilePage />}
                restaurantComponent={<RestaurantProfilePage />}
              />
            }
          />

          {/* Müşteriye Özel Sayfalar (Yeni takma adlar) */}
          <Route
            path='/qr'
            element={
              <RoleRenderer
                customerComponent={<CustomerQRPage />}
                // Restoranın /qr sayfası yoksa null veya Navigate ile başka yere yönlendir
                restaurantComponent={<Navigate to='/' replace />}
              />
            }
          />

          {/* Restorana Özel Sayfalar (Yeni takma adlar) */}
          <Route
            path='/menu'
            element={
              <RoleRenderer
                // Müşterinin /menu sayfası yoksa null veya Navigate
                customerComponent={<Navigate to='/' replace />}
                restaurantComponent={<RestaurantMenuPage />}
              />
            }
          />
          <Route
            path='/orders'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />} // Müşterinin /orders sayfası yok
                restaurantComponent={<RestaurantOrdersPage />}
              />
            }
          />
          <Route
            path='/orders/:orderId'
            element={
              <RoleRenderer
                customerComponent={<Navigate to='/' replace />} // Müşterinin sayfası yok
                restaurantComponent={<RestaurantOrderDetailPage />}
              />
            }
          />
          {/* Diğer sayfalar da benzer şekilde eklenebilir */}
        </Route>

        {/* Yakalanamayan tüm yollar için ana sayfaya yönlendirme veya 404 */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

// Yardımcı Bileşen: RoleRenderer (Değişiklik yok)
const RoleRenderer = ({ customerComponent, restaurantComponent }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>İçerik yükleniyor...</div>;
  }

  if (!user) {
    // Bu durumun PrivateRoute tarafından yakalanması gerekir ama ek kontrol
    return <Navigate to='/login' replace />;
  }

  if (user.isRestaurantEmployee === 1) {
    return restaurantComponent;
  }
  return customerComponent;
};

export default App;
