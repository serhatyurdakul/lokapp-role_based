import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading: authIsLoading,
  } = useSelector((state) => state.auth);
  const location = useLocation();

  // Kimlik doğrulama durumu veya kullanıcı bilgisi Redux'tan yükleniyorsa ve henüz kimlik doğrulanmamışsa
  if (authIsLoading && !isAuthenticated) {
    // TODO: loading spinner eklenebilir
    return <div>Yönlendirme kontrol ediliyor...</div>;
  }

  // Eğer kullanıcı kimliği doğrulanmamışsa login'e yönlendir.
  // `state={{ from: location }}` kullanıcı giriş yaptıktan sonra geldiği sayfaya dönebilmesi için.
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
