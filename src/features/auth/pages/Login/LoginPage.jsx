import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../store/authSlice";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import Button from "@/components/common/Button/Button";
import "./LoginPage.scss";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux stateinden isAuthenticated, isLoading ve error u alma
  const {
    isAuthenticated,
    isLoading: authIsLoading, // Redux taki genel yükleme durumu
    error: authError, // Redux taki genel hata durumu
  } = useSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false); // Buton için lokal yükleme durumu
  const [localError, setLocalError] = useState(null); // Lokal hata mesajı için

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // isAuthenticated true olduğunda ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    // authSlice da clearError olup olmadığını kontrol etmeye gerek yok, varsa importta hata vermezse çağrılır.
    dispatch(clearError());

    try {
      // Redux login işlemi
      await dispatch(login(formData)).unwrap();
      // Başarılı olursa, yukarıdaki useEffect yönlendirmeyi yapacak.
    } catch (rejectedValue) {
      // unwrap(), thunk tan dönen hata mesajını fırlatır
      console.error("Giriş hatası (LoginPage catch):", rejectedValue);
      // Gelen hatanın yapısını kontrol ederek daha iyi bir mesaj oluşturma
      let errorMessage = "Giriş işlemi sırasında bir hata oluştu.";
      if (typeof rejectedValue === "string") {
        errorMessage = rejectedValue;
      } else if (rejectedValue && rejectedValue.message) {
        errorMessage = rejectedValue.message;
      } else if (authError && authError.message) {
        // Redux taki hatayı da kontrol et
        errorMessage = authError.message;
      } else if (typeof authError === "string") {
        errorMessage = authError;
      }
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1>Giriş Yap</h1>
      {/* Hata mesajlarını gösterirken hem localError hem de authError u dikkate alabiliriz */}
      {/* Öncelik localError, sonra Redux tan gelen authError */}
      {(localError || (authError && !isSubmitting && !localError)) && (
        <div className='error-message'>
          {localError ||
            authError?.message ||
            (typeof authError === "string"
              ? authError
              : "Bilinmeyen bir hata oluştu.")}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Email'
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          isClearable={true}
          onClear={() => setFormData(prev => ({ ...prev, email: "" }))}
        />
        <FormInput
          label='Şifre'
          type='password'
          id='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className='form-actions'>
          <Button
            type='submit'
            variant='primary'
            disabled={isSubmitting || authIsLoading}
          >
            {isSubmitting || authIsLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
