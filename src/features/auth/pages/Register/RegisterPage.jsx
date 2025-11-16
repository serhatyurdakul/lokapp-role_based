import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FormInput from "@/common/components/forms/FormInput/FormInput";
import FormSelect from "@/common/components/forms/FormSelect/FormSelect";
import Button from "@/common/components/Button/Button";
import ErrorMessage from "@/common/components/forms/ErrorMessage/ErrorMessage";
import NoticeBanner from "@/common/components/NoticeBanner/NoticeBanner";
import PageHeader from "@/common/components/PageHeader/PageHeader";

import { register, clearError } from "../../store/authSlice";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import {
  fetchCities,
  fetchDistricts,
  fetchRestaurants,
} from "../../../../utils/api";
import "./RegisterPage.scss";

const STEPS = {
  CATEGORY: "category",
  ROLE: "role",
  CONTEXT: "context",
  CONFIRM: "confirm",
  DETAILS: "details",
  SUCCESS: "success",
};

const USER_ROLES = {
  companyEmployee: "companyEmployee",
  restaurantEmployee: "restaurantEmployee",
  individual: "individual",
};

const COMPANY_ROLE_OPTIONS = [
  { value: "employee", label: "Firma Çalışanı" },
  { value: "manager", label: "Firma Yetkilisi" },
  { value: "super", label: "Firma Süper Kullanıcısı" },
];

const RESTAURANT_ROLE_OPTIONS = [
  { value: "chef", label: "Aşçı" },
  { value: "manager", label: "Restoran Sorumlusu" },
];

const MIN_COMPANY_CODE_LENGTH = 4;

// Temporary stub until backend provides firm code verification endpoint.
const mockVerifyCompanyCode = async (code) => {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    throw new Error("Firma kodu zorunludur");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    companyId: 9999,
    companyName: "Demo Firma",
    companyCode: trimmedCode,
    cityId: 34,
    cityName: "İstanbul",
    districtId: 158,
    districtName: "Beylikdüzü",
    contractedRestaurantId: 1,
    contractedRestaurantName: "Demo Restoran",
    isApproved: 1,
  };
};

const StepHeader = ({ title, description }) => (
  <div className='registration-step-header'>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>
);

const StepIndicator = ({ steps, currentIndex }) => (
  <nav className='registration-step-indicator' aria-label='Kayıt adımları'>
    <ol>
      {steps.map((step, index) => (
        <li
          key={step.key}
          className={[
            "registration-step-indicator__item",
            index === currentIndex ? "is-active" : "",
            index < currentIndex ? "is-completed" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={index === currentIndex ? "step" : undefined}
        >
          <span className='registration-step-indicator__index'>{index + 1}</span>
          <span className='registration-step-indicator__label'>{step.label}</span>
        </li>
      ))}
    </ol>
  </nav>
);

const RegistrationWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.auth
  );

  const [currentStep, setCurrentStep] = useState(STEPS.CATEGORY);
  const [userRole, setUserRole] = useState(null);
  const [businessInfoVisible, setBusinessInfoVisible] = useState(false);

  const [companyCode, setCompanyCode] = useState("");
  const [companyValidation, setCompanyValidation] = useState({
    status: "idle",
    data: null,
    error: "",
    checkedCode: "",
  });

  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState("");

  const [restaurantContext, setRestaurantContext] = useState({
    cityId: "",
    districtId: "",
    districts: [],
    isDistrictLoading: false,
    districtError: "",
    restaurantId: "",
    restaurants: [],
    isRestaurantLoading: false,
    restaurantError: "",
    selectedRestaurant: null,
  });

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyRole: COMPANY_ROLE_OPTIONS[0].value,
    restaurantRole: RESTAURANT_ROLE_OPTIONS[0].value,
    freeCompanyName: "",
    freeCompanyAddress: "",
  });

  const [personalErrors, setPersonalErrors] = useState({});
  const companyValidationDebounceRef = useRef(null);

  const openMailClient = (mailtoUrl) => {
    if (typeof window === "undefined") return;
    try {
      window.open(mailtoUrl, "_blank");
    } catch (error) {
      console.error("Mail istemcisi açılamadı", error);
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, currentStep]);

  useEffect(() => {
    setRestaurantContext({
      cityId: "",
      districtId: "",
      districts: [],
      isDistrictLoading: false,
      districtError: "",
      restaurantId: "",
      restaurants: [],
      isRestaurantLoading: false,
      restaurantError: "",
      selectedRestaurant: null,
    });
    setPersonalInfo((prev) => ({
      ...prev,
      companyRole: COMPANY_ROLE_OPTIONS[0].value,
      restaurantRole: RESTAURANT_ROLE_OPTIONS[0].value,
      freeCompanyName: "",
      freeCompanyAddress: "",
    }));
    setPersonalErrors({});
  }, [userRole]);

  const resetWizard = () => {
    setCurrentStep(STEPS.CATEGORY);
    setUserRole(null);
    setBusinessInfoVisible(false);
    setCompanyCode("");
    setCompanyValidation({ status: "idle", data: null, error: "", checkedCode: "" });
    setRestaurantContext({
      cityId: "",
      districtId: "",
      districts: [],
      isDistrictLoading: false,
      districtError: "",
      restaurantId: "",
      restaurants: [],
      isRestaurantLoading: false,
      restaurantError: "",
      selectedRestaurant: null,
    });
    setPersonalInfo({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyRole: COMPANY_ROLE_OPTIONS[0].value,
      restaurantRole: RESTAURANT_ROLE_OPTIONS[0].value,
      freeCompanyName: "",
      freeCompanyAddress: "",
    });
    setPersonalErrors({});
  };

  const handleCategorySelection = (type) => {
    if (type === "business") {
      setBusinessInfoVisible(true);
      openMailClient("mailto:destek@lokapp.com?subject=Lokapp%20Kurumsal%20Kayıt");
      return;
    }
    setCurrentStep(STEPS.ROLE);
  };

  const handleRetryCompanyValidation = () => {
    handleCompanyCodeValidate();
  };

  const handleCompanyCodeReset = () => {
    setCompanyCode("");
    setCompanyValidation({ status: "idle", data: null, error: "", checkedCode: "" });
  };

  const handleSwitchToIndividual = () => {
    setUserRole(USER_ROLES.individual);
    setCurrentStep(STEPS.DETAILS);
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);

    if (role === USER_ROLES.companyEmployee) {
      setCurrentStep(STEPS.CONTEXT);
      return;
    }

    if (role === USER_ROLES.restaurantEmployee) {
      if (cities.length === 0 && !isCitiesLoading) {
        loadCities();
      }
      setCurrentStep(STEPS.CONTEXT);
      return;
    }

    setCurrentStep(STEPS.DETAILS);
  };

  const loadCities = async () => {
    setIsCitiesLoading(true);
    setCitiesError("");
    try {
      const response = await fetchCities();
      setCities(response);
    } catch (error) {
      setCities([]);
      setCitiesError(error.message || "Şehirler yüklenemedi");
    } finally {
      setIsCitiesLoading(false);
    }
  };

  const handleCompanyCodeValidate = async ({ auto = false } = {}) => {
    const trimmedCode = companyCode.trim();
    if (!trimmedCode) {
      setCompanyValidation({
        status: "error",
        data: null,
        error: "Firma kodu zorunludur",
        checkedCode: "",
      });
      return;
    }

    if (auto && trimmedCode.length < MIN_COMPANY_CODE_LENGTH) {
      return;
    }

    if (
      companyValidation.status === "success" &&
      companyValidation.data?.companyCode === trimmedCode
    ) {
      return;
    }

    if (companyValidation.status === "loading") return;
    setCompanyValidation({ status: "loading", data: null, error: "", checkedCode: trimmedCode });
    try {
      const result = await mockVerifyCompanyCode(trimmedCode);
      if (Number(result.isApproved) === 0) {
        setCompanyValidation({
          status: "error",
          data: null,
          error: "Bu firma henüz onaylanmamış. Lütfen yöneticinizle iletişime geçin.",
          checkedCode: trimmedCode,
        });
        return;
      }
      setCompanyValidation({
        status: "success",
        data: result,
        error: "",
        checkedCode: trimmedCode,
      });
      setCurrentStep(STEPS.CONFIRM);
    } catch (error) {
      setCompanyValidation({
        status: "error",
        data: null,
        error: error.message || "Firma kodu doğrulanamadı",
        checkedCode: trimmedCode,
      });
    }
  };

  useEffect(() => {
    if (companyValidationDebounceRef.current) {
      clearTimeout(companyValidationDebounceRef.current);
    }

    const trimmed = companyCode.trim();

    if (!trimmed) {
      if (companyValidation.status !== "idle") {
        setCompanyValidation({ status: "idle", data: null, error: "", checkedCode: "" });
      }
      return undefined;
    }

    if (companyValidation.status === "loading") {
      return undefined;
    }

    if (trimmed.length < MIN_COMPANY_CODE_LENGTH) {
      return undefined;
    }

    if (
      companyValidation.status === "error" &&
      companyValidation.checkedCode === trimmed
    ) {
      return undefined;
    }

    companyValidationDebounceRef.current = setTimeout(() => {
      handleCompanyCodeValidate({ auto: true });
    }, 600);

    return () => {
      if (companyValidationDebounceRef.current) {
        clearTimeout(companyValidationDebounceRef.current);
      }
    };
  }, [companyCode, companyValidation.status, companyValidation.checkedCode]);

  const handleRestaurantCityChange = async (cityId) => {
    setRestaurantContext((prev) => ({
      ...prev,
      cityId,
      districtId: "",
      districts: [],
      isDistrictLoading: true,
      districtError: "",
      restaurantId: "",
      restaurants: [],
      selectedRestaurant: null,
    }));
    if (!cityId) {
      setRestaurantContext((prev) => ({
        ...prev,
        isDistrictLoading: false,
        districtError: "",
      }));
      return;
    }
    try {
      const response = await fetchDistricts(cityId);
      setRestaurantContext((prev) => ({
        ...prev,
        districts: response,
        isDistrictLoading: false,
        districtError: response.length === 0 ? "Bu şehir için ilçe bulunamadı" : "",
      }));
    } catch (error) {
      setRestaurantContext((prev) => ({
        ...prev,
        districts: [],
        isDistrictLoading: false,
        districtError: error.message || "İlçeler yüklenemedi",
      }));
    }
  };

  const handleRestaurantDistrictChange = async (districtId) => {
    setRestaurantContext((prev) => ({
      ...prev,
      districtId,
      restaurantId: "",
      restaurants: [],
      isRestaurantLoading: true,
      restaurantError: "",
      selectedRestaurant: null,
    }));
    if (!districtId) {
      setRestaurantContext((prev) => ({
        ...prev,
        isRestaurantLoading: false,
        restaurantError: "",
      }));
      return;
    }
    try {
      const response = await fetchRestaurants(districtId, restaurantContext.cityId);
      setRestaurantContext((prev) => ({
        ...prev,
        restaurants: response,
        isRestaurantLoading: false,
        restaurantError: response.length === 0 ? "Bu ilçe için restoran bulunamadı" : "",
      }));
    } catch (error) {
      setRestaurantContext((prev) => ({
        ...prev,
        restaurants: [],
        isRestaurantLoading: false,
        restaurantError: error.message || "Restoranlar yüklenemedi",
      }));
    }
  };

  const handleRestaurantSelect = (restaurantId) => {
    const selected = restaurantContext.restaurants.find(
      (item) => String(item.id) === String(restaurantId)
    );
    setRestaurantContext((prev) => ({
      ...prev,
      restaurantId,
      selectedRestaurant: selected
        ? {
            ...selected,
            cityId: selected.cityId || selected.city_id || selected.cityID,
            cityName: selected.cityName || selected.city_name,
            districtId: selected.districtId || selected.district_id || selected.districtID,
            districtName: selected.districtName || selected.district_name,
          }
        : null,
    }));
  };

  const canContinueContext = useMemo(() => {
    if (userRole === USER_ROLES.companyEmployee) {
      return companyValidation.status === "success" && companyValidation.data;
    }
    if (userRole === USER_ROLES.restaurantEmployee) {
      return Boolean(restaurantContext.selectedRestaurant);
    }
    return false;
  }, [userRole, companyValidation, restaurantContext.selectedRestaurant]);

  const handleContextContinue = () => {
    if (!canContinueContext) return;

    setCurrentStep(STEPS.CONFIRM);
  };

  const summaryInfo = useMemo(() => {
    if (userRole === USER_ROLES.companyEmployee) {
      return companyValidation.data;
    }
    if (userRole === USER_ROLES.restaurantEmployee) {
      return restaurantContext.selectedRestaurant;
    }
    return null;
  }, [userRole, companyValidation.data, restaurantContext.selectedRestaurant]);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    setPersonalErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validatePersonalStep = () => {
    const errors = {};
    if (!personalInfo.name.trim()) {
      errors.name = "Ad soyad zorunludur";
    }
    if (!personalInfo.email.trim()) {
      errors.email = "E-posta zorunludur";
    }
    if (personalInfo.password.length < 8) {
      errors.password = "Şifre en az 8 karakter olmalıdır";
    }
    if (personalInfo.password !== personalInfo.confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
    }

    if (userRole === USER_ROLES.companyEmployee && !personalInfo.companyRole) {
      errors.companyRole = "Pozisyon seçmelisiniz";
    }
    if (userRole === USER_ROLES.restaurantEmployee && !personalInfo.restaurantRole) {
      errors.restaurantRole = "Pozisyon seçmelisiniz";
    }

    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    const basePayload = {
      name: personalInfo.name.trim(),
      email: personalInfo.email.trim().toLowerCase(),
      password: personalInfo.password,
      osType: 1,
    };

    if (userRole === USER_ROLES.companyEmployee) {
      const company = companyValidation.data;
      const roleMap = {
        employee: 4,
        manager: 3,
        super: 6,
      };
      const roleId = roleMap[personalInfo.companyRole] || 4;
      return {
        ...basePayload,
        cityId: Number(company.cityId),
        districtId: Number(company.districtId),
        userTypeId: 2,
        roleId,
        isCompanyEmployee: 1,
        isRestaurantEmployee: 0,
        isFreeEmployee: 0,
        companyId: Number(company.companyId),
        restaurantId: company.contractedRestaurantId
          ? Number(company.contractedRestaurantId)
          : null,
        freeEmployeeCompanyName: null,
        freeEmployeeCompanyAddress: null,
      };
    }

    if (userRole === USER_ROLES.restaurantEmployee) {
      const restaurant = restaurantContext.selectedRestaurant;
      const roleMap = {
        chef: 1,
        manager: 2,
      };
      const roleId = roleMap[personalInfo.restaurantRole] || 1;
      return {
        ...basePayload,
        cityId: Number(restaurant.cityId || restaurant.cityID || restaurant.city_id || 0),
        districtId: Number(
          restaurant.districtId || restaurant.districtID || restaurant.district_id || 0
        ),
        userTypeId: 1,
        roleId,
        isCompanyEmployee: 0,
        isRestaurantEmployee: 1,
        isFreeEmployee: 0,
        companyId: null,
        restaurantId: Number(restaurant.id || restaurant.restaurantId || 0),
        freeEmployeeCompanyName: null,
        freeEmployeeCompanyAddress: null,
      };
    }

    // Individual (free) user
    return {
      ...basePayload,
      cityId: 0,
      districtId: 0,
      userTypeId: 2,
      roleId: 4,
      isCompanyEmployee: 0,
      isRestaurantEmployee: 0,
      isFreeEmployee: 1,
      companyId: null,
      restaurantId: null,
      freeEmployeeCompanyName: personalInfo.freeCompanyName.trim() || null,
      freeEmployeeCompanyAddress: personalInfo.freeCompanyAddress.trim() || null,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePersonalStep()) return;

    try {
      dispatch(clearError());
      const payload = buildPayload();
      await dispatch(register(payload)).unwrap();
      setCurrentStep(STEPS.SUCCESS);
    } catch (error) {
      // Errors already handled by redux and displayed via ErrorMessage.
      console.error("Registration error", error);
    }
  };

  const renderCategoryStep = () => (
    <div className='registration-step'>
      <StepHeader
        title='Kayıt türünüzü seçin'
        description='Size uygun seçeneği belirleyip devam edin.'
      />
      {businessInfoVisible && (
        <NoticeBanner
          message='Firma veya restoran kaydı için lütfen yönetici ekibiyle iletişime geçin: destek@lokapp.com'
          onClose={() => setBusinessInfoVisible(false)}
          actionText='Mail Gönder'
          onAction={() => openMailClient("mailto:destek@lokapp.com?subject=Lokapp%20Kurumsal%20Kayıt")}
        />
      )}
      <div className='registration-card-grid'>
        <button
          type='button'
          className='registration-card'
          onClick={() => handleCategorySelection("business")}
        >
          <div className='registration-card__content'>
            <h3>Firma &amp; Restoran Kaydı</h3>
            <p>İşletme kaydı için devam edin.</p>
          </div>
          <span className='registration-card__cta'>İletişime geç</span>
        </button>
        <button
          type='button'
          className='registration-card'
          onClick={() => handleCategorySelection("user")}
        >
          <div className='registration-card__content'>
            <h3>Kullanıcı Kaydı</h3>
            <p>Sipariş vermek veya restoranda yemek kaydı yapmak için hesap oluşturun.</p>
          </div>
          <span className='registration-card__cta'>Devam et</span>
        </button>
      </div>
    </div>
  );

  const renderRoleStep = () => (
    <div className='registration-step'>
      <StepHeader
        title='Hangi kullanıcı türüyle kaydolacaksınız?'
        description='Size en uygun seçeneği belirleyip devam edin.'
      />
      <div className='registration-card-grid'>
        <button
          type='button'
          className='registration-card'
          onClick={() => handleRoleSelect(USER_ROLES.individual)}
        >
          <div className='registration-card__content'>
            <h3>Bireysel Kullanıcı</h3>
            <p>Bireysel kayıt için devam edin.</p>
          </div>
        </button>
        <button
          type='button'
          className='registration-card'
          onClick={() => handleRoleSelect(USER_ROLES.companyEmployee)}
        >
          <div className='registration-card__content'>
            <h3>Firma Çalışanı</h3>
            <p>Firma kodunuzla giriş yaparak anlaşmalı restoranların menüsünü görün.</p>
          </div>
        </button>
        <button
          type='button'
          className='registration-card'
          onClick={() => handleRoleSelect(USER_ROLES.restaurantEmployee)}
        >
          <div className='registration-card__content'>
            <h3>Restoran Çalışanı</h3>
            <p>Restoran paneli üzerinden menü ve sipariş süreçlerini yönetin.</p>
          </div>
        </button>
      </div>
      <div className='registration-actions registration-actions--start'>
        <Button variant='secondary' type='button' onClick={resetWizard}>
          Geri
        </Button>
      </div>
    </div>
  );

  const renderCompanyContext = () => (
    <div className='registration-step'>
      <StepHeader
        title='Firma kodunuzu doğrulayın'
        description='Firma yöneticinizin paylaştığı kodu girin. Kod elinizde yoksa yöneticinizle iletişime geçin.'
      />
      <div className='registration-form-grid'>
        <FormInput
          label='Firma Kodu'
          id='companyCode'
          name='companyCode'
          value={companyCode}
          onChange={(event) => {
            setCompanyCode(event.target.value);
            setCompanyValidation({ status: "idle", data: null, error: "", checkedCode: "" });
          }}
          required
          labelAdornment={<span>En az {MIN_COMPANY_CODE_LENGTH} karakter</span>}
          isClearable={true}
          onClear={() => {
            setCompanyCode("");
            setCompanyValidation({ status: "idle", data: null, error: "", checkedCode: "" });
          }}
          error={companyValidation.status === "error" ? companyValidation.error : ""}
        />
        <Button
          type='button'
          variant='primary'
          className='registration-inline-button'
          onClick={handleCompanyCodeValidate}
          loading={companyValidation.status === "loading"}
          disabled={companyCode.trim().length < MIN_COMPANY_CODE_LENGTH}
        >
          Doğrula
        </Button>
      </div>
      {companyValidation.status === "success" && companyValidation.data && (
        <NoticeBanner
          message={`✅ ${companyValidation.data.companyName} şirketi doğrulandı. Anlaşmalı restoran: ${companyValidation.data.contractedRestaurantName || "Belirtilmemiş"}. Devam ederek sipariş ekranına geçebilirsiniz.`}
        />
      )}
      {companyValidation.status === "error" && companyValidation.error && (
        <div className='registration-error-actions'>
          <p className='registration-error-actions__message'>{companyValidation.error}</p>
          <div className='registration-error-actions__buttons'>
            <Button type='button' variant='primary' onClick={handleRetryCompanyValidation}>
              Tekrar Dene
            </Button>
            <Button type='button' variant='secondary' onClick={handleCompanyCodeReset}>
              Farklı Kod Dene
            </Button>
            <button
              type='button'
              className='registration-error-actions__link'
              onClick={() => openMailClient("mailto:destek@lokapp.com?subject=Firma%20Kodu%20Yardım")}
            >
              Yardım Al
            </button>
            <button
              type='button'
              className='registration-error-actions__link'
              onClick={handleSwitchToIndividual}
            >
              Bireysel Kayıt Yap
            </button>
          </div>
        </div>
      )}
      <div className='registration-actions registration-actions--start'>
        <Button
          variant='secondary'
          type='button'
          onClick={() => setCurrentStep(STEPS.ROLE)}
        >
          Geri
        </Button>
      </div>
    </div>
  );

  const renderRestaurantContext = () => (
    <div className='registration-step'>
      <StepHeader
        title='Restoran seçin'
        description='Çalıştığınız restoranı bulmak için önce şehir ve ilçe seçin, ardından listelenen restorandan devam edin.'
      />
      <div className='registration-form-stack'>
        <FormSelect
          label='Şehir'
          id='restaurant-city'
          name='restaurant-city'
          value={restaurantContext.cityId}
          onChange={(event) => handleRestaurantCityChange(event.target.value)}
          options={cities}
          defaultOptionText={isCitiesLoading ? "Şehirler yükleniyor..." : "Şehir seçin"}
          disabled={isCitiesLoading}
          error={citiesError}
        />
        <FormSelect
          label='İlçe'
          id='restaurant-district'
          name='restaurant-district'
          value={restaurantContext.districtId}
          onChange={(event) => handleRestaurantDistrictChange(event.target.value)}
          options={restaurantContext.districts}
          defaultOptionText={
            !restaurantContext.cityId
              ? "Önce şehir seçin"
              : restaurantContext.isDistrictLoading
                ? "İlçeler yükleniyor..."
                : "İlçe seçin"
          }
          disabled={
            !restaurantContext.cityId || restaurantContext.isDistrictLoading
          }
          error={restaurantContext.districtError}
        />
        <FormSelect
          label='Restoran'
          id='restaurant'
          name='restaurant'
          value={restaurantContext.restaurantId}
          onChange={(event) => handleRestaurantSelect(event.target.value)}
          options={restaurantContext.restaurants.map((item) => ({
            value: item.id,
            label: item.name || item.restaurantName,
            cityName: item.cityName,
            districtName: item.districtName,
            cityId: item.cityId,
            districtId: item.districtId,
          }))}
          defaultOptionText={
            !restaurantContext.districtId
              ? "Önce ilçe seçin"
              : restaurantContext.isRestaurantLoading
                ? "Restoranlar yükleniyor..."
                : "Restoran seçin"
          }
          disabled={
            !restaurantContext.districtId || restaurantContext.isRestaurantLoading
          }
          error={restaurantContext.restaurantError}
        />
      </div>
      <div className='registration-actions registration-actions--start'>
        <Button
          variant='secondary'
          type='button'
          onClick={() => setCurrentStep(STEPS.ROLE)}
        >
          Geri
        </Button>
        <Button
          variant='primary'
          type='button'
          disabled={!canContinueContext}
          onClick={handleContextContinue}
        >
          Devam Et
        </Button>
      </div>
    </div>
  );

  const renderContextStep = () => {
    if (userRole === USER_ROLES.companyEmployee) {
      return renderCompanyContext();
    }
    if (userRole === USER_ROLES.restaurantEmployee) {
      return renderRestaurantContext();
    }
    return null;
  };

  const renderConfirmStep = () => (
    <div className='registration-step'>
      <StepHeader
        title='Bilgileri doğrulayın'
        description='Kaydınız aşağıdaki bilgilerle oluşturulacak.'
      />
      <div className='registration-summary-card'>
        {userRole === USER_ROLES.companyEmployee && summaryInfo && (
          <>
            <h3>{summaryInfo.companyName}</h3>
            <ul>
              <li>Firma Kodu: {summaryInfo.companyCode}</li>
              <li>Şehir / İlçe: {summaryInfo.cityName} / {summaryInfo.districtName}</li>
              <li>
                Anlaşmalı Restoran: {summaryInfo.contractedRestaurantName || "Belirtilmemiş"}
              </li>
            </ul>
          </>
        )}
        {userRole === USER_ROLES.restaurantEmployee && summaryInfo && (
          <>
            <h3>{summaryInfo.name || summaryInfo.restaurantName}</h3>
            <ul>
              <li>
                Şehir / İlçe: {summaryInfo.cityName || summaryInfo.city || summaryInfo.city_id || summaryInfo.cityId || "Belirtilmemiş"}
                {" "}/
                {summaryInfo.districtName || summaryInfo.district || summaryInfo.district_id || summaryInfo.districtId || "Belirtilmemiş"}
              </li>
            </ul>
          </>
        )}
      </div>
      <div className='registration-actions'>
        <Button
          variant='secondary'
          type='button'
          onClick={() => setCurrentStep(STEPS.CONTEXT)}
        >
          Geri
        </Button>
        <Button
          variant='primary'
          type='button'
          onClick={() => setCurrentStep(STEPS.DETAILS)}
        >
          Devam Et
        </Button>
      </div>
    </div>
  );

  const renderPersonalDetailsStep = () => (
    <div className='registration-step'>
      <StepHeader
        title='Hesap bilgilerinizi girin'
        description='Kaydınızı tamamlamak için kişisel bilgilerinizi doldurun.'
      />
      <form className='registration-form-stack' onSubmit={handleSubmit}>
        <FormInput
          label='Ad Soyad'
          id='name'
          name='name'
          value={personalInfo.name}
          onChange={(event) => handlePersonalInfoChange("name", event.target.value)}
          required
          error={personalErrors.name}
          isClearable={true}
          onClear={() => handlePersonalInfoChange("name", "")}
        />
        <FormInput
          label='E-posta'
          id='email'
          name='email'
          type='email'
          value={personalInfo.email}
          onChange={(event) => handlePersonalInfoChange("email", event.target.value)}
          required
          error={personalErrors.email}
          isClearable={true}
          onClear={() => handlePersonalInfoChange("email", "")}
        />
        <FormInput
          label='Şifre'
          id='password'
          name='password'
          type='password'
          value={personalInfo.password}
          onChange={(event) => handlePersonalInfoChange("password", event.target.value)}
          required
          error={personalErrors.password}
        />
        <FormInput
          label='Şifre Tekrar'
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          value={personalInfo.confirmPassword}
          onChange={(event) =>
            handlePersonalInfoChange("confirmPassword", event.target.value)
          }
          required
          error={personalErrors.confirmPassword}
        />

        {userRole === USER_ROLES.companyEmployee && (
          <FormSelect
            label='Pozisyonunuz'
            id='companyRole'
            name='companyRole'
            value={personalInfo.companyRole}
            onChange={(event) => handlePersonalInfoChange("companyRole", event.target.value)}
            options={COMPANY_ROLE_OPTIONS}
            defaultOptionText='Seçiniz'
            error={personalErrors.companyRole}
          />
        )}

        {userRole === USER_ROLES.restaurantEmployee && (
          <FormSelect
            label='Pozisyonunuz'
            id='restaurantRole'
            name='restaurantRole'
            value={personalInfo.restaurantRole}
            onChange={(event) =>
              handlePersonalInfoChange("restaurantRole", event.target.value)
            }
            options={RESTAURANT_ROLE_OPTIONS}
            defaultOptionText='Seçiniz'
            error={personalErrors.restaurantRole}
          />
        )}

        {userRole === USER_ROLES.individual && (
          <>
            <p className='registration-optional-hint'>Firma bilgisi isteğe bağlıdır; yoksa boş bırakabilirsiniz.</p>
            <FormInput
              label='Firma Adı'
              id='freeCompanyName'
              name='freeCompanyName'
              value={personalInfo.freeCompanyName}
              onChange={(event) =>
                handlePersonalInfoChange("freeCompanyName", event.target.value)
              }
              error={personalErrors.freeCompanyName}
            />
            <FormInput
              label='Firma Adresi'
              id='freeCompanyAddress'
              name='freeCompanyAddress'
              value={personalInfo.freeCompanyAddress}
              onChange={(event) =>
                handlePersonalInfoChange("freeCompanyAddress", event.target.value)
              }
              error={personalErrors.freeCompanyAddress}
            />
          </>
        )}

        <ErrorMessage message={reduxError?.message || reduxError} />

        <div className='registration-actions registration-actions--in-form'>
          <Button
            variant='secondary'
            type='button'
            onClick={() => {
              if (userRole === USER_ROLES.companyEmployee || userRole === USER_ROLES.restaurantEmployee) {
                setCurrentStep(STEPS.CONFIRM);
              } else {
                setCurrentStep(STEPS.ROLE);
              }
            }}
          >
            Geri
          </Button>
          <Button
            variant='primary'
            type='submit'
            loading={reduxLoading}
          >
            Kaydı Tamamla
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className='registration-step registration-step--success'>
      <StepHeader
        title='Kayıt işleminiz alındı'
        description='Giriş yaparak Lokapp deneyimine devam edebilirsiniz.'
      />
      <div className='registration-actions registration-actions--start'>
        <Button variant='primary' type='button' onClick={() => navigate("/login")}>
          Giriş Yap
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.CATEGORY:
        return renderCategoryStep();
      case STEPS.ROLE:
        return renderRoleStep();
      case STEPS.CONTEXT:
        return renderContextStep();
      case STEPS.CONFIRM:
        return renderConfirmStep();
      case STEPS.DETAILS:
        return renderPersonalDetailsStep();
      case STEPS.SUCCESS:
        return renderSuccessStep();
      default:
        return renderCategoryStep();
    }
  };

  const stepSequence = useMemo(() => {
    const sequence = [
      { key: STEPS.CATEGORY, label: "Kategori" },
      { key: STEPS.ROLE, label: "Kullanıcı Türü" },
    ];

    if (userRole === USER_ROLES.companyEmployee || userRole === USER_ROLES.restaurantEmployee) {
      sequence.push(
        { key: STEPS.CONTEXT, label: "Doğrulama" },
        { key: STEPS.CONFIRM, label: "Onay" }
      );
    }

    sequence.push(
      { key: STEPS.DETAILS, label: "Bilgiler" },
      { key: STEPS.SUCCESS, label: "Tamamlandı" }
    );

    return sequence;
  }, [userRole]);

  const currentStepIndex = useMemo(() => {
    const index = stepSequence.findIndex((step) => step.key === currentStep);
    return index === -1 ? 0 : index;
  }, [stepSequence, currentStep]);

  const {
    name: personalName,
    email: personalEmail,
    password: personalPassword,
  } = personalInfo;

  const hasUnsavedChanges = useMemo(() => {
    if (currentStep === STEPS.SUCCESS) return false;
    if (userRole) return true;
    if (companyCode.trim()) return true;
    if (personalName.trim() || personalEmail.trim() || personalPassword.trim()) {
      return true;
    }
    return false;
  }, [currentStep, userRole, companyCode, personalName, personalEmail, personalPassword]);

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className='registration-wizard'>
      <PageHeader title='Kayıt Ol' />
      <header className='registration-progress'>
        <StepIndicator steps={stepSequence} currentIndex={currentStepIndex} />
        <span className='registration-progress__meta'>
          Adım {currentStepIndex + 1} / {stepSequence.length}
        </span>
      </header>
      {renderStepContent()}
    </div>
  );
};

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegistrationWizard />
    </AuthLayout>
  );
};

export default RegisterPage;
