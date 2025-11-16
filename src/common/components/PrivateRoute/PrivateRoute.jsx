import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "@/common/components/Loading/Loading.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading: authIsLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (authIsLoading && !isAuthenticated) {
    return <Loading text='Yönlendiriliyor...' />;
  }

  // Preserve original destination so user is redirected back after login
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
