import axios from "axios";

// API URL
export const API_BASE_URL = "https://emreustaa.com/public/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiResponse = (response, dataKey = null) => {
  if (response && response.data) {
    const { data } = response;

    // Check for API-level error flag
    if (data.error === true) {
      if (
        (data.message &&
          (data.message.includes("listesi bulunamadı") ||
            data.message.includes("liste bulunamadı"))) ||
        data.status === 422
      ) {
        console.log(
          "API'den beklenen veri bulunamadı (handleApiResponse):",
          data.message
        );
      } else {
        console.error("API yanıtında hata (handleApiResponse):", data.message);
      }
      return [];
    }

    if (dataKey && data[dataKey] && Array.isArray(data[dataKey])) {
      return data[dataKey];
    }

    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    console.warn(
      "API yanıtı beklenen dizi formatında değil veya veri içermiyor (handleApiResponse):",
      data
    );
    return [];
  }

  console.error("Geçersiz veya boş API yanıtı (handleApiResponse):", response);
  return [];
};

export const endpoints = {
  register: "/registerUser",
  login: "/loginUser",
  verifyToken: "/verifyToken",

  cities: "/cities",
  districts: "/districts",
  industrialZones: "/industrialZones",
  industrialSites: "/getIndustrialSites",
  restaurants: "/restaurants",
  findLocaleCompany: "/findLocaleCompany",
  getMealsWithRestaurantId: "/getMealsWithRestaurantId",
  getCategories: "/getCategories",
  getMealMenu: "/getMealMenu",
  createOrder: "/createOrder",
  getRestaurantsOrderList: "/getRestaurantsOrderList",
  getRestaurantOrderDetails: "/getRestaurantOrderDetails",
  setOrderStatus: "/setOrderStatus",
};

// Auth helpers
export const setAuthHeaders = (token, uniqueId) => {
  if (token && uniqueId) {
    localStorage.setItem("token", token);
    localStorage.setItem("uniqueId", uniqueId); // uniqueId'yi de localStorage'a yazma
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api.defaults.headers.common["uniqueId"] = uniqueId; // uniqueId header'ını ekleme
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("uniqueId"); // uniqueId'yi de localStorage'dan silme
    localStorage.removeItem("user"); // "user" anahtarını da localStorage'dan silme
    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["uniqueId"]; // uniqueId header'ını silme
  }
};

const initialToken = localStorage.getItem("token");
const initialUniqueId = localStorage.getItem("uniqueId"); // uniqueId'yi de localStorage'dan okuma

if (initialToken && initialUniqueId) {
  setAuthHeaders(initialToken, initialUniqueId); // Her ikisi de varsa header'ları ayarlama
} else {
  // Eğer biri eksikse, tutarlılık için ikisini de temizleyebiliriz.
  // Bu, sadece token varken ama uniqueId yokken (veya tam tersi) bir durum oluşmasını engeller.
  setAuthHeaders(null, null); // Header'ları ve localStorage'ı temizleme
}

export const fetchCities = async () => {
  try {
    const response = await api.get(endpoints.cities);
    return handleApiResponse(response, "cityList");
  } catch (error) {
    console.error("fetchCities genel API hatası:", error.message || error);
    return [];
  }
};

export const fetchDistricts = async (cityId) => {
  try {
    const response = await api.get(`${endpoints.districts}?cityId=${cityId}`);
    return handleApiResponse(response, "districtList");
  } catch (error) {
    console.error(
      `fetchDistricts genel API hatası (cityId: ${cityId}):`,
      error.message || error
    );
    return [];
  }
};

export const fetchIndustrialZones = async () => {
  try {
    const response = await api.get(endpoints.industrialZones);
    return handleApiResponse(response, "industrialZoneList");
  } catch (error) {
    console.error(
      "fetchIndustrialZones genel API hatası:",
      error.message || error
    );
    return [];
  }
};

export const fetchIndustrialSites = async (districtId, cityId) => {
  try {
    const queryParams = {};
    if (districtId) queryParams.districtId = districtId;
    if (cityId) queryParams.cityId = cityId;

    const response = await api.get(endpoints.industrialSites, {
      params: queryParams,
    });
    return handleApiResponse(response, "industrialSiteList");
  } catch (error) {
    console.error(
      `fetchIndustrialSites genel API hatası (districtId: ${districtId}, cityId: ${cityId}):`,
      error.message || error
    );
    return [];
  }
};

export const fetchRestaurants = async (districtId, cityId) => {
  try {
    const queryParams = {};
    if (districtId) queryParams.districtId = districtId;
    if (cityId) queryParams.cityId = cityId;

    const response = await api.get(endpoints.restaurants, {
      params: queryParams,
    });
    return handleApiResponse(response, "restaurantList");
  } catch (error) {
    console.error(
      `fetchRestaurants genel API hatası (districtId: ${districtId}, cityId: ${cityId}):`,
      error.message || error
    );
    return [];
  }
};

// Auth request functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post(endpoints.register, userData);

    // Hata durumlarını kontrol etme
    if (response.data.error || response.data.status >= 400) {
      const apiError = new Error(
        response.data.message || "Kayıt sırasında sunucuda bir hata oluştu."
      );
      apiError.isOperational = true;
      throw apiError;
    }

    if (response.data.errors && typeof response.data.errors === "object") {
      const validationError = new Error("Formda validasyon hataları bulundu.");
      validationError.fieldErrors = response.data.errors;
      validationError.isValidationError = true;
      throw validationError;
    }
    return response.data;
  } catch (error) {
    if (error.isValidationError || error.isOperational) {
      throw error;
    }
    // Axios hatası veya diğer beklenmedik hataları kontrol etme
    if (error.response && error.response.data) {
      console.error(
        "registerUser - API Hata Yanıtı (Detaylı):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Kayıt sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    console.error("Kullanıcı kaydı API genel hatası:", error.message || error);
    throw new Error(
      error.message ||
        "Kayıt sırasında bilinmeyen bir ağ hatası veya sunucu hatası oluştu."
    );
  }
};

// Kullanıcı girişi için API fonksiyonu
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(endpoints.login, credentials);

    // Hata durumlarını kontrol etme
    if (response.data.error || response.data.status >= 400) {
      const apiError = new Error(
        response.data.message || "Giriş sırasında sunucuda bir hata oluştu."
      );
      apiError.isOperational = true;
      throw apiError;
    }

    if (response.data.errors && typeof response.data.errors === "object") {
      const validationError = new Error(
        "Giriş formunda validasyon hataları bulundu."
      );
      validationError.fieldErrors = response.data.errors;
      validationError.isValidationError = true;
      throw validationError;
    }
    return response.data;
  } catch (error) {
    if (error.isValidationError || error.isOperational) {
      throw error;
    }
    // Axios hatası veya diğer beklenmedik hatalar
    if (error.response && error.response.data) {
      console.error(
        "loginUser - API Hata Yanıtı (Detaylı):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Giriş sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    console.error("Kullanıcı girişi API genel hatası:", error.message || error);
    throw new Error(
      error.message ||
        "Giriş sırasında bilinmeyen bir ağ hatası veya sunucu hatası oluştu."
    );
  }
};

// Token doğrulama için API fonksiyonu
export const verifyUserToken = async (token) => {
  try {
    const response = await api.post(endpoints.verifyToken, { token });

    // Hata durumlarını kontrol etme
    if (response.data.error || response.data.status >= 400) {
      const apiError = new Error(
        response.data.message || "Token doğrulama sırasında bir hata oluştu."
      );
      apiError.isOperational = true;
      throw apiError;
    }

    return response.data;
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    // Axios hatası veya diğer beklenmedik hatalar
    if (error.response && error.response.data) {
      console.error(
        "verifyUserToken - API Hata Yanıtı (Detaylı):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Token doğrulama sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    console.error("Token doğrulama API genel hatası:", error.message || error);
    throw new Error(
      error.message ||
        "Token doğrulama sırasında bilinmeyen bir ağ hatası veya sunucu hatası oluştu."
    );
  }
};

export const fetchLocaleCompanies = async (
  cityId,
  districtId,
  industrialSiteId
) => {
  try {
    const queryParams = {};
    if (cityId) queryParams.cityId = cityId;
    if (districtId) queryParams.districtId = districtId;
    if (industrialSiteId) queryParams.industrialSiteId = industrialSiteId;

    const response = await api.get(endpoints.findLocaleCompany, {
      params: queryParams,
    });
    return handleApiResponse(response, "companyList");
  } catch (error) {
    console.error(
      `fetchLocaleCompanies genel API hatası (cityId: ${cityId}, districtId: ${districtId}, industrialSiteId: ${industrialSiteId}):`,
      error.message || error
    );
    return [];
  }
};

// Yeni eklenen yemekleri getirme fonksiyonu
export const fetchRestaurantMeals = async (restaurantId) => {
  try {
    // Kullanıcı bilgilerini localStorage'dan alma
    const userJson = localStorage.getItem("user");
    let user = null;
    let uniqueId = null;

    try {
      if (userJson) {
        user = JSON.parse(userJson);
        uniqueId = user.uniqueId;
      }
    } catch (parseError) {
      console.error(
        "Kullanıcı bilgileri parse edilemedi (fetchRestaurantMeals):",
        parseError
      );
      // uniqueId null kalacak, bu durumda header a eklenmeyecek
    }

    const requestHeaders = {};
    if (uniqueId) {
      requestHeaders["uniqueId"] = uniqueId;
    }

    const queryParams = {};
    if (restaurantId) {
      queryParams.restaurantId = restaurantId;
    }

    const response = await api.get(endpoints.getMealsWithRestaurantId, {
      params: queryParams,
      headers: requestHeaders,
    });

    // API yanıtı yapısını inceleme
    console.log("Restoran Yemekleri API yanıtı veri yapısı:", {
      isArray: Array.isArray(response.data),
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      dataKeys: response.data ? Object.keys(response.data) : [], // response.data null/undefined kontrolü
    });

    if (response.data) {
      if (response.data.error === true) {
        console.log(
          "API yanıtı hata içeriyor (fetchRestaurantMeals):",
          response.data.message
        );
        throw new Error(response.data.message || "Yemekler alınamadı");
      }
      if (response.data.mealList && Array.isArray(response.data.mealList)) {
        return response.data.mealList;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.error(
        "API yanıtında uygun formatta yemek verisi bulunamadı (fetchRestaurantMeals):",
        response.data
      );
      return [];
    }
    return [];
  } catch (error) {
    console.error(
      "Restoran Yemekleri API hatası (fetchRestaurantMeals genel):",
      error
    );
    if (error.response) {
      console.error("API hata yanıtı (fetchRestaurantMeals):", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }
    throw new Error(error.message || "Yemekler alınamadı");
  }
};

export const fetchMealCategories = async () => {
  try {
    const response = await api.get(endpoints.getCategories);
    // handleApiResponse, categoryList anahtarını ve isActive filtresini dikkate almalı
    const categories = handleApiResponse(response, "categoryList");
    if (Array.isArray(categories)) {
      return categories.filter((category) => category.isActive === "1");
    }
    return [];
  } catch (error) {
    console.error("fetchMealCategories API hatası:", error.message || error);
    return [];
  }
};

export const fetchMealOptionsByCategory = async (categoryId) => {
  try {
    const response = await api.get(
      `${endpoints.getMealMenu}?categoryId=${categoryId}`
    );
    const meals = handleApiResponse(response, "data"); // API yanıtı 'data' anahtarı altında
    if (Array.isArray(meals)) {
      return meals.map((meal) => ({
        ...meal,
        // categoryId string olarak gelirse, sayıya çevirme
        categoryId: meal.categoryId ? parseInt(meal.categoryId, 10) : null,
        id: meal.id ? parseInt(meal.id, 10) : null,
      }));
    }
    return [];
  } catch (error) {
    console.error(
      `fetchMealOptionsByCategory API hatası (categoryId: ${categoryId}):`,
      error.message || error
    );
    return [];
  }
};

export const fetchRestaurantMenu = async (restaurantId) => {
  try {
    const response = await api.get(
      `${endpoints.getMealsWithRestaurantId}?restaurantId=${restaurantId}`
    );
    const mealListByCategory = handleApiResponse(response, "mealList");

    if (Array.isArray(mealListByCategory)) {
      return mealListByCategory.map((categoryGroup) => ({
        ...categoryGroup,
        meals: Array.isArray(categoryGroup.meals)
          ? categoryGroup.meals.map((meal) => ({
              ...meal,
              categoryId: meal.categoryId
                ? parseInt(meal.categoryId, 10)
                : null,
              quantity: meal.quantity ? parseInt(meal.quantity, 10) : 0, // Stok yoksa 0
            }))
          : [],
      }));
    }
    return [];
  } catch (error) {
    console.error(
      `fetchRestaurantMenu API hatası (restaurantId: ${restaurantId}):`,
      error.message || error
    );
    return [];
  }
};

export const addRestaurantMeal = async (mealData) => {
  try {
    const response = await api.post("/addMealForRestaurant", mealData);
    return response.data;
  } catch (error) {
    console.error(
      "addRestaurantMeal API hatası:",
      error.response?.data || error.message || error
    );
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      error: true,
      message: error.message || "Yemek eklenirken bilinmeyen bir hata oluştu.",
    };
  }
};

export const updateMealForRestaurant = async (mealData) => {
  try {
    const response = await api.post("/updateMealForRestaurant", mealData);
    return response.data;
  } catch (error) {
    console.error(
      "updateMealForRestaurant API hatası:",
      error.response?.data || error.message || error
    );
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      error: true,
      message:
        error.message || "Yemek güncellenirken bilinmeyen bir hata oluştu.",
    };
  }
};

export const deleteMealFromRestaurant = async (deleteData) => {
  try {
    // API, POST yöntemini ve JSON body formatını bekliyor
    const response = await api.post("/deleteMealFromRestaurant", deleteData);
    return response.data;
  } catch (error) {
    console.error(
      "deleteMealFromRestaurant API hatası:",
      error.response?.data || error.message || error
    );

    if (error.response && error.response.data) {
      // Sunucu yanıtı mevcutsa onu aynen döndür
      return error.response.data;
    }

    // Axios veya ağ hatası
    return {
      error: true,
      message: error.message || "Yemek silinirken bilinmeyen bir hata oluştu.",
    };
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post(endpoints.createOrder, orderData);

    // API'den dönen yanıtın içindeki .data'yı kontrol ediyoruz.
    const responseData = response.data;

    // API'nin kendi içindeki `error: true` bayrağını kontrol et
    if (responseData.error || responseData.status >= 400) {
      // API'den anlamlı bir hata mesajı geliyorsa onu kullan
      const message =
        responseData.message || "Sipariş oluşturulurken bir hata oluştu.";
      const apiError = new Error(message);

      // Token hatası gibi özel durumları ayırt etmek için
      if (responseData.tokenError) {
        apiError.tokenError = true;
      }
      throw apiError;
    }

    // Başarılı durumda, sipariş bilgisini içeren tüm yanıtı döndür
    return responseData;
  } catch (error) {
    // Yukarıda bizim fırlattığımız `apiError` ise tekrar fırlat
    if (error.isOperational || error.tokenError) {
      throw error;
    }

    // Axios veya ağ hatası ise, daha genel bir hata mesajı oluştur
    if (error.response) {
      // Sunucudan bir yanıt geldi ama status kodu 2xx değil
      console.error(
        "createOrder - API Hata Yanıtı (Detaylı):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Sipariş oluşturma sırasında sunucuda bir hata oluştu.";
      throw new Error(message);
    } else if (error.request) {
      // İstek yapıldı ama yanıt alınamadı
      console.error("createOrder - Yanıt Alınamadı:", error.request);
      throw new Error(
        "Sipariş oluşturulamadı, lütfen daha sonra tekrar deneyin."
      );
    } else {
      // İsteği hazırlarken bir hata oluştu
      console.error("createOrder - İstek Kurulum Hatası:", error.message);
      throw new Error("Sipariş isteği oluşturulurken bir hata oluştu.");
    }
  }
};

export const getRestaurantsOrderList = async (restaurantId, tabId = 0) => {
  try {
    const response = await api.get(endpoints.getRestaurantsOrderList, {
      params: { restaurantId, tabId },
    });
    // Doğrudan tüm yanıtı döndür, hata kontrolü ve veri işleme thunk içinde yapılacak
    return response.data;
  } catch (error) {
    console.error(
      "Restoran sipariş listesi API hatası:",
      error.response?.data || error.message
    );
    // Hata durumunda, hatayı fırlatarak thunk'ın reject case'ine düşmesini sağla
    throw new Error(
      error.response?.data?.message || "Sipariş listesi alınamadı."
    );
  }
};

export const getRestaurantOrderDetails = async (restaurantId, companyId) => {
  try {
    const response = await api.get(endpoints.getRestaurantOrderDetails, {
      params: { restaurantId, companyId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Restoran sipariş detayı API hatası:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Sipariş detayları alınamadı."
    );
  }
};

export const setOrderStatus = async (statusData) => {
  try {
    const response = await api.post(endpoints.setOrderStatus, statusData);
    return response.data;
  } catch (error) {
    console.error(
      "Sipariş durumu güncelleme API hatası:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Sipariş durumu güncellenemedi."
    );
  }
};
