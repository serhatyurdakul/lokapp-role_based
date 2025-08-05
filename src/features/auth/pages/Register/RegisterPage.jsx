import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FormInput from "@/components/common/forms/FormInput/FormInput";
import FormSelect from "@/components/common/forms/FormSelect/FormSelect";
import Button from "@/components/common/Button/Button";
import ErrorMessage from "@/components/common/forms/ErrorMessage/ErrorMessage";

import { register } from "../../store/authSlice";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import {
  fetchCities,
  fetchDistricts,
  fetchIndustrialSites,
  fetchRestaurants,
  fetchLocaleCompanies,
} from "../../../../utils/api";
import "./RegisterPage.scss";

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    city: "",
    district: "",
    restaurant: "",
    industrialSite: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [industrialSites, setIndustrialSites] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState({ submit: false });
  const [error, setError] = useState("");

  const [inputErrors, setInputErrors] = useState({
    name: "",
    email: "",
    userType: "",
    city: "",
    district: "",
    restaurant: "",
    industrialSite: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (formData.userType) {
      const loadCities = async () => {
        try {
          const response = await fetchCities();
          setCities(response);
        } catch (err) {
          setError("Şehirler yüklenirken bir hata oluştu");
          setCities([]);
        }
      };

      loadCities();
    }
  }, [formData.userType]);

  const handleCityChange = async (cityId) => {
    setFormData({
      ...formData,
      city: cityId,
      district: "",
      restaurant: "",
      industrialSite: "",
      company: "",
    });

    try {
      const response = await fetchDistricts(cityId);
      setDistricts(response);
    } catch (err) {
      setError("İlçeler yüklenirken bir hata oluştu");
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setFormData({
      ...formData,
      district: districtId,
      restaurant: "",
      industrialSite: "",
      company: "",
    });

    // Load restaurants or industrial sites based on user type
    if (
      formData.userType === "restaurantEmployee" ||
      formData.userType === "restaurantManager"
    ) {
      try {
        const response = await fetchRestaurants(districtId, formData.city);
        setRestaurants(response);
      } catch (err) {
        setError("Restoranlar yüklenirken bir hata oluştu");
        setRestaurants([]);
      }
    } else if (
      formData.userType === "companyEmployee" ||
      formData.userType === "companyManager"
    ) {
      try {
        const response = await fetchIndustrialSites(districtId, formData.city);
        setIndustrialSites(response);
      } catch (err) {
        setError("Sanayi siteleri yüklenirken bir hata oluştu");
        setIndustrialSites([]);
      }
    }
  };

  const handleIndustrialSiteChange = async (siteId) => {
    setFormData({ ...formData, industrialSite: siteId });

    try {
      const response = await fetchLocaleCompanies(
        formData.city,
        formData.district,
        siteId
      );
      setCompanies(response);
    } catch (err) {
      setError("Firmalar yüklenirken bir hata oluştu");
      setCompanies([]);
    }
  };

  const handleUserTypeChange = async (type) => {
    setFormData({
      ...formData,
      userType: type,
      city: "",
      district: "",
      restaurant: "",
      industrialSite: "",
      company: "",
    });

    setDistricts([]);
    setRestaurants([]);
    setIndustrialSites([]);
    setCompanies([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setError("");
    setInputErrors({
      name: "",
      email: "",
      userType: "",
      city: "",
      district: "",
      restaurant: "",
      industrialSite: "",
      company: "",
      password: "",
      confirmPassword: "",
    });

    let hasError = false;
    const newInputErrors = { ...inputErrors };

    if (formData.password !== formData.confirmPassword) {
      newInputErrors.confirmPassword = "Şifreler eşleşmiyor";
      hasError = true;
    }

    if (formData.password.length < 8) {
      newInputErrors.password = "Şifreniz en az 8 karakter olmalıdır";
      hasError = true;
    }

    // Ensure company selected for company roles
    if (
      (formData.userType === "companyEmployee" ||
        formData.userType === "companyManager") &&
      !formData.company
    ) {
      newInputErrors.company = "Firma seçmelisiniz";
      hasError = true;
    }

    if (hasError) {
      setInputErrors(newInputErrors);
      setLoading((prev) => ({ ...prev, submit: false }));
      return;
    }

    // Prepare payload for API
    let determinedUserTypeId = null;
    let determinedRoleId = null;

    if (formData.userType === "restaurantEmployee") {
      determinedUserTypeId = 1; // userTypes.id for "Restaurant Employee"
      determinedRoleId = 1; // roles.id for "Chef"
    } else if (formData.userType === "restaurantManager") {
      determinedUserTypeId = 1; // userTypes.id for "Restaurant Employee"
      determinedRoleId = 2; // roles.id for "Restaurant Manager"
    } else if (formData.userType === "companyEmployee") {
      determinedUserTypeId = 2; // userTypes.id for "Company Employee"
      determinedRoleId = 4; // roles.id for "Company Employee"
    } else if (formData.userType === "companyManager") {
      determinedUserTypeId = 2; // userTypes.id for "Company Employee"
      determinedRoleId = 3; // roles.id for "Company Manager"
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      osType: 1,
      cityId: Number(formData.city),
      districtId: Number(formData.district),
      userTypeId: determinedUserTypeId,
      roleId: determinedRoleId,
      isCompanyEmployee: determinedUserTypeId === 2 ? 1 : 0,
      isRestaurantEmployee: determinedUserTypeId === 1 ? 1 : 0,
      isFreeEmployee: 0,
      companyId: determinedUserTypeId === 2 ? Number(formData.company) : null,
      restaurantId:
        determinedUserTypeId === 1 ? Number(formData.restaurant) : null,
      freeEmployeeCompanyName: null,
      freeEmployeeCompanyAddress: null,
    };

    try {
      await dispatch(register(userData)).unwrap();
      navigate("/login");
    } catch (err) {
      setLoading((prev) => ({ ...prev, submit: false }));
      if (err.isValidationError && err.fieldErrors) {
        const newServerInputErrors = {};
        for (const key in err.fieldErrors) {
          if (inputErrors.hasOwnProperty(key)) {
            newServerInputErrors[key] = Array.isArray(err.fieldErrors[key])
              ? err.fieldErrors[key][0]
              : err.fieldErrors[key];
          }
        }
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          ...newServerInputErrors,
        }));
        setError("Lütfen formdaki işaretli alanları düzeltip tekrar deneyin.");
      } else {
        setError(err.message || "Kayıt sırasında bilinmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <>
      <h1>Kullanıcı Kaydı</h1>

      <form onSubmit={handleSubmit}>
        {/* Common fields for all user types */}
        <FormInput
          label="Ad Soyad"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={inputErrors.name}
          isClearable={true}
          onClear={() => setFormData((prev) => ({ ...prev, name: "" }))}
        />

        <FormInput
          label="E-Mail"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={inputErrors.email}
          isClearable={true}
          onClear={() => setFormData((prev) => ({ ...prev, email: "" }))}
        />

        <FormSelect
          label="Kullanıcı Tipi"
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={(e) => handleUserTypeChange(e.target.value)}
          required
          error={inputErrors.userType}
          defaultOptionText="Seçiniz"
          options={[
            { value: "restaurantEmployee", label: "Lokanta Çalışanı" },
            { value: "restaurantManager", label: "Lokanta Sorumlusu" },
            { value: "companyEmployee", label: "Firma Çalışanı" },
            { value: "companyManager", label: "Firma Sorumlusu" },
          ]}
        />

        {/* Restaurant Employee/Manager fields */}
        {(formData.userType === "restaurantEmployee" ||
          formData.userType === "restaurantManager") && (
          <>
            <FormSelect
              label="İl"
              id="city-user-restaurant"
              name="city"
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required
              error={inputErrors.city}
              options={cities}
              defaultOptionText="Seçiniz"
              disabledOptionText="Şehir bilgisi yüklenemedi"
            />

            {formData.city && (
              <FormSelect
                label="İlçe"
                id="district-user-restaurant"
                name="district"
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                required
                error={inputErrors.district}
                options={districts}
                defaultOptionText="Seçiniz"
                disabledOptionText="İlçe bilgisi yüklenemedi"
              />
            )}

            {formData.district && (
              <FormSelect
                label="Restoran"
                id="restaurant-user"
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                required
                error={inputErrors.restaurant}
                options={restaurants}
                defaultOptionText="Seçiniz"
                disabledOptionText="Bu ilçede kayıtlı restoran bulunamadı"
              />
            )}

            <FormInput
              label="Şifre"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={inputErrors.password}
            />

            <FormInput
              label="Şifre Tekrar"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={inputErrors.confirmPassword}
            />
          </>
        )}

        {/* Company Employee/Manager fields */}
        {(formData.userType === "companyEmployee" ||
          formData.userType === "companyManager") && (
          <>
            <FormSelect
              label="İl"
              id="city-user-company"
              name="city"
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required
              error={inputErrors.city}
              options={cities}
              defaultOptionText="Seçiniz"
              disabledOptionText="Şehir bilgisi yüklenemedi"
            />

            {formData.city && (
              <FormSelect
                label="İlçe"
                id="district-user-company"
                name="district"
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                required
                error={inputErrors.district}
                options={districts}
                defaultOptionText="Seçiniz"
                disabledOptionText="İlçe bilgisi yüklenemedi"
              />
            )}

            {formData.district && (
              <FormSelect
                label="Sanayi Sitesi"
                id="industrialSite-user"
                name="industrialSite"
                value={formData.industrialSite}
                onChange={(e) => handleIndustrialSiteChange(e.target.value)}
                required
                error={inputErrors.industrialSite}
                options={industrialSites}
                defaultOptionText="Seçiniz"
                disabledOptionText="Bu ilçede kayıtlı sanayi sitesi bulunamadı"
              />
            )}

            {formData.industrialSite && (
              <FormSelect
                label="Firma"
                id="company-user"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                error={inputErrors.company}
                options={companies}
                defaultOptionText="Seçiniz"
                disabledOptionText="Bu sanayi sitesinde kayıtlı firma bulunamadı"
              />
            )}

            <FormInput
              label="Şifre"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={inputErrors.password}
            />

            <FormInput
              label="Şifre Tekrar"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={inputErrors.confirmPassword}
            />
          </>
        )}

        <ErrorMessage message={error || reduxError} />

        <div className="form-actions">
          <Button
            variant="primary"
            type="submit"
            disabled={loading.submit || reduxLoading}
          >
            {loading.submit || reduxLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </Button>
        </div>
      </form>
    </>
  );
};

const RegisterPage = () => {
  return (
    <AuthLayout>
      <UserRegistrationForm />
    </AuthLayout>
  );
};

export default RegisterPage;
