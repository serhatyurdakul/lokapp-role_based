import { Link, useLocation } from "react-router-dom";
import "./AuthLayout.scss";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className='auth-layout'>
      <div className='auth-layout__box'>
        {children}
        <p className='auth-layout__link'>
          {isLoginPage ? (
            <>
              Hesabınız yok mu? <Link to='/register'>Kayıt Ol</Link>
            </>
          ) : (
            <>
              Zaten hesabınız var mı? <Link to='/login'>Giriş Yap</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
