import { Link, useLocation } from 'react-router-dom';
import './AuthLayout.scss';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        {children}
        <p className='auth-link'>
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
