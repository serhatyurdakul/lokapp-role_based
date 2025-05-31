import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/authSlice";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormInput from "@/components/common/forms/FormInput/FormInput";
import FormSelect from "@/components/common/forms/FormSelect/FormSelect";
import Button from "@/components/common/Button/Button";
import {
  fetchCities,
  fetchDistricts,
  fetchIndustrialSites,
  fetchRestaurants,
  fetchLocaleCompanies,
  registerUser,
} from "../../../../utils/api";
import "./RegisterPage.scss";



// Kullanıcı kayıt formu
const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: reduxLoading, error: reduxError } = useSelector((state) => state.auth);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Her alan için ayrı hata mesajları
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

  // Şehirleri formData.userType değiştiğinde yükle
  useEffect(() => {
    // Eğer kullanıcı tipi seçilmişse şehirleri yükle
    if (formData.userType) {
      const loadCities = async () => {
        try {
          const response = await fetchCities();
          setCities(response);
        } catch (err) {
          console.error("Şehirler yüklenirken hata:", err);
          setError("Şehirler yüklenirken bir hata oluştu");
          setCities([]);
        }
      };

      loadCities();
    }
  }, [formData.userType]); // Sadece kullanıcı tipi değiştiğinde şehirleri yükle

  const handleCityChange = async (cityId) => {
    setFormData({
      ...formData,
      city: cityId,
      district: "",
      restaurant: "",
      industrialSite: "",
      company: "",
    });

    // Seçilen şehire göre ilçeleri yükle
    try {
      const response = await fetchDistricts(cityId);
      setDistricts(response);
    } catch (err) {
      console.error("İlçeler yüklenirken hata:", err);
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

    // Kullanıcı tipine göre restaurant veya sanayi sitelerini yükle
    if (
      formData.userType === "restaurantEmployee" ||
      formData.userType === "restaurantManager"
    ) {
      // Restoranları yükle
      try {
        const response = await fetchRestaurants(districtId, formData.city);
        setRestaurants(response);
      } catch (err) {
        console.error("Restoranlar yüklenirken hata:", err);
        setError("Restoranlar yüklenirken bir hata oluştu");
        setRestaurants([]);
      }
    } else if (
      formData.userType === "companyEmployee" ||
      formData.userType === "companyManager"
    ) {
      // Sanayi sitelerini yükle
      try {
        const response = await fetchIndustrialSites(districtId, formData.city);
        setIndustrialSites(response);
      } catch (err) {
        console.error("Sanayi siteleri yüklenirken hata:", err);
        setError("Sanayi siteleri yüklenirken bir hata oluştu");
        setIndustrialSites([]);
      }
    }
  };

  const handleIndustrialSiteChange = async (siteId) => {
    setFormData({ ...formData, industrialSite: siteId });

    // Eğer API'den firmalar çekilecekse buraya eklenebilir
    try {
      const response = await fetchLocaleCompanies(
        formData.city,
        formData.district,
        siteId
      );
      setCompanies(response);
    } catch (err) {
      console.error("Firmalar yüklenirken hata:", err);
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

    // Kullanıcı tipi değiştiğinde ilçeleri temizle
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
    setIsLoading(true);
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

    // Form validation
    let hasError = false;
    const newInputErrors = { ...inputErrors };

    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      newInputErrors.confirmPassword = "Şifreler eşleşmiyor";
      hasError = true;
    }

    // Şifre uzunluk kontrolü
    if (formData.password.length < 8) {
      newInputErrors.password = "Şifreniz en az 8 karakter olmalıdır";
      hasError = true;
    }

    // Firma kontrolü - Eğer firma çalışanı/sorumlusu seçildiyse
    if (
      (formData.userType === "companyEmployee" ||
        formData.userType === "companyManager") &&
      !formData.company
    ) {
      newInputErrors.company = "Firma seçmelisiniz";
      hasError = true;
    }

    // Hata varsa güncelle ve işlemi durdur
    if (hasError) {
      setInputErrors(newInputErrors);
      setIsLoading(false);
      return;
    }

    // API için verileri hazırla
    let determinedUserTypeId = null;
    let determinedRoleId = null;

    if (formData.userType === "restaurantEmployee") {
      determinedUserTypeId = 1; // userTypes.id for "Lokanta Çalışanı"
      determinedRoleId = 1; // roles.id for "Aşçı" (assuming Lokanta Çalışanı maps to Aşçı role)
    } else if (formData.userType === "restaurantManager") {
      determinedUserTypeId = 1; // userTypes.id for "Lokanta Çalışanı"
      determinedRoleId = 2; // roles.id for "Lokanta Sorumlusu"
    } else if (formData.userType === "companyEmployee") {
      determinedUserTypeId = 2; // userTypes.id for "Firma Çalışanı"
      determinedRoleId = 4; // roles.id for "Firma Çalışanı"
    } else if (formData.userType === "companyManager") {
      determinedUserTypeId = 2; // userTypes.id for "Firma Çalışanı"
      determinedRoleId = 3; // roles.id for "Firma Sorumlusu"
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
      // Redux üzerinden kayıt işlemini gerçekleştir
      await dispatch(register(userData)).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Kayıt işlemi hatası:", err); // Hatanın yapısını detaylı görebilmek için
      setIsLoading(false);
      if (err.isValidationError && err.fieldErrors) {
        const newServerInputErrors = {};
        for (const key in err.fieldErrors) {
          if (inputErrors.hasOwnProperty(key)) {
            // Gelen hata bir dizi ise ilk elemanı al, string ise doğrudan ata
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
        // Diğer tüm hatalar (isOperational veya genel hatalar)
        setError(err.message || "Kayıt sırasında bilinmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <>
      <h1>Kullanıcı Kaydı</h1>

      <form onSubmit={handleSubmit}>
        {/* Temel Bilgiler - Tüm kullanıcı tipleri için */}
        <FormInput
          label='Ad Soyad'
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          error={inputErrors.name}
          isClearable={true}
          onClear={() => setFormData(prev => ({ ...prev, name: "" }))}
        />

        <FormInput
          label='E-Mail'
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          error={inputErrors.email}
          isClearable={true}
          onClear={() => setFormData(prev => ({ ...prev, email: "" }))}
        />

        <FormSelect
          label='Kullanıcı Tipi'
          id='userType'
          name='userType'
          value={formData.userType}
          onChange={(e) => handleUserTypeChange(e.target.value)}
          required
          error={inputErrors.userType}
          defaultOptionText='Seçiniz'
          options={[
            { value: "restaurantEmployee", label: "Lokanta Çalışanı" },
            { value: "restaurantManager", label: "Lokanta Sorumlusu" },
            { value: "companyEmployee", label: "Firma Çalışanı" },
            { value: "companyManager", label: "Firma Sorumlusu" },
          ]}
        />

        {/* Lokanta Çalışanı veya Lokanta Sorumlusu ise */}
        {(formData.userType === "restaurantEmployee" ||
          formData.userType === "restaurantManager") && (
          <>
            <FormSelect
              label='İl'
              id='city-user-restaurant'
              name='city'
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required
              error={inputErrors.city}
              options={cities}
              defaultOptionText='Seçiniz'
              disabledOptionText='Şehir bilgisi yüklenemedi'
            />

            {formData.city && (
              <FormSelect
                label='İlçe'
                id='district-user-restaurant'
                name='district'
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                required
                error={inputErrors.district}
                options={districts}
                defaultOptionText='Seçiniz'
                disabledOptionText='İlçe bilgisi yüklenemedi'
              />
            )}

            {formData.district && (
              <FormSelect
                label='Restoran'
                id='restaurant-user'
                name='restaurant'
                value={formData.restaurant}
                onChange={handleChange}
                required
                error={inputErrors.restaurant}
                options={restaurants}
                defaultOptionText='Seçiniz'
                disabledOptionText='Bu ilçede kayıtlı restoran bulunamadı'
              />
            )}

            <FormInput
              label='Şifre'
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              error={inputErrors.password}
              isClearable={true}
              onClear={() => setFormData(prev => ({ ...prev, password: "" }))}
            />

            <FormInput
              label='Şifre Tekrar'
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={inputErrors.confirmPassword}
              isClearable={true}
              onClear={() => setFormData(prev => ({ ...prev, confirmPassword: "" }))}
            />
          </>
        )}

        {/* Firma Çalışanı veya Firma Sorumlusu ise */}
        {(formData.userType === "companyEmployee" ||
          formData.userType === "companyManager") && (
          <>
            <FormSelect
              label='İl'
              id='city-user-company'
              name='city'
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required
              error={inputErrors.city}
              options={cities}
              defaultOptionText='Seçiniz'
              disabledOptionText='Şehir bilgisi yüklenemedi'
            />

            {formData.city && (
              <FormSelect
                label='İlçe'
                id='district-user-company'
                name='district'
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                required
                error={inputErrors.district}
                options={districts}
                defaultOptionText='Seçiniz'
                disabledOptionText='İlçe bilgisi yüklenemedi'
              />
            )}

            {formData.district && (
              <FormSelect
                label='Sanayi Sitesi'
                id='industrialSite-user'
                name='industrialSite'
                value={formData.industrialSite}
                onChange={(e) => handleIndustrialSiteChange(e.target.value)}
                required
                error={inputErrors.industrialSite}
                options={industrialSites}
                defaultOptionText='Seçiniz'
                disabledOptionText='Bu ilçede kayıtlı sanayi sitesi bulunamadı'
              />
            )}

            {formData.industrialSite && (
              <FormSelect
                label='Firma'
                id='company-user'
                name='company'
                value={formData.company}
                onChange={handleChange}
                required
                error={inputErrors.company}
                options={companies}
                defaultOptionText='Seçiniz'
                disabledOptionText='Bu sanayi sitesinde kayıtlı firma bulunamadı'
              />
            )}

            <FormInput
              label='Şifre'
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              error={inputErrors.password}
              isClearable={true}
              onClear={() => setFormData(prev => ({ ...prev, password: "" }))}
            />

            <FormInput
              label='Şifre Tekrar'
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={inputErrors.confirmPassword}
              isClearable={true}
              onClear={() => setFormData(prev => ({ ...prev, confirmPassword: "" }))}
            />
          </>
        )}

        {(error || reduxError) && (
          <div className='error-message global-form-error'>{error || reduxError}</div>
        )}

        <div className='form-actions'>
          <Button variant='primary' type='submit' disabled={isLoading || reduxLoading}>
            {isLoading || reduxLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </Button>
        </div>
      </form>
    </>
  );
};

// Ana Register bileşeni
const RegisterPage = () => {
  return (
    <AuthLayout>
      <UserRegistrationForm />
    </AuthLayout>
  );
};

export default RegisterPage;
