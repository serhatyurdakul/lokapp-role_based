import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../store/authSlice";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import Button from "@/components/common/Button/Button";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";
import "./LoginPage.scss";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    isLoading: authIsLoading,
    error: authError,
  } = useSelector((state) => state.auth);

  const [localError, setLocalError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleClearEmail = () => {
    setFormData((prev) => ({ ...prev, email: "" }));
  };

  const getDisplayError = () => {
    if (localError) return localError;
    if (authError && !authIsLoading) {
      if (typeof authError === "string") return authError;
      if (authError?.message) return authError.message;
      return "Bilinmeyen bir hata oluştu.";
    }
    return null;
  };

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
    setLocalError(null);

    dispatch(clearError());

    try {
      await dispatch(login(formData)).unwrap();
    } catch (rejectedValue) {
      // unwrap() throws the rejected value
      // Build a user-friendly error message
      let errorMessage = "Giriş işlemi sırasında bir hata oluştu.";
      if (typeof rejectedValue === "string") {
        errorMessage = rejectedValue;
      } else if (rejectedValue && rejectedValue.message) {
        errorMessage = rejectedValue.message;
      }
      setLocalError(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <h1>Giriş Yap</h1>
      <ErrorMessage message={getDisplayError()} />
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          isClearable={true}
          onClear={handleClearEmail}
        />
        <FormInput
          label="Şifre"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="form-actions">
          <Button type="submit" variant="primary" disabled={authIsLoading}>
            {authIsLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
