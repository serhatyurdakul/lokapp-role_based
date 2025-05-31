import axios from "axios";

// API URL
export const API_BASE_URL = "https://emreustaa.com/public/api";

// API instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API responses for GET requests that expect an array
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
      return []; // Return empty array on API error, maintaining current behavior
    }

    // If a specific dataKey is provided and exists as an array
    if (dataKey && data[dataKey] && Array.isArray(data[dataKey])) {
      return data[dataKey];
    }

    // If response.data.data exists and is an array (common pattern)
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    // If response.data itself is an array
    if (Array.isArray(data)) {
      return data;
    }

    console.warn(
      "API yanıtı beklenen dizi formatında değil veya veri içermiyor (handleApiResponse):",
      data
    );
    return []; // Return empty array if no known data structure is found
  }

  console.error("Geçersiz veya boş API yanıtı (handleApiResponse):", response);
  return []; // Return empty array for invalid/empty response
};

// API endpoints
export const endpoints = {
  // Auth
  register: "/registerUser",
  login: "/loginUser",
  verifyToken: "/verifyToken",

  // Data
  cities: "/cities",
  districts: "/districts",
  industrialZones: "/industrialZones",
  industrialSites: "/getIndustrialSites",
  restaurants: "/restaurants",
  findLocaleCompany: "/findLocaleCompany",
  getMealsWithRestaurantId: "/getMealsWithRestaurantId",
  getCategories: "/getCategories",
  getMealMenu: "/getMealMenu",
};

// Auth helpers
export const setAuthHeaders = (token, uniqueId) => {
  if (token && uniqueId) {
    localStorage.setItem("token", token);
    localStorage.setItem("uniqueId", uniqueId); // uniqueId'yi de localStorage'a yaz
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api.defaults.headers.common["UniqueId"] = uniqueId; // UniqueId header'ını ekle
    // console.log("Auth headers set. Token:", token, "UniqueId:", uniqueId); // Geliştirme için log
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("uniqueId"); // uniqueId'yi de localStorage'dan sil
    localStorage.removeItem("user"); // "user" anahtarını da localStorage'dan sil
    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["UniqueId"]; // UniqueId header'ını sil
    // console.log("Auth headers cleared."); // Geliştirme için log
  }
};

// Initialize auth token AND UniqueId from localStorage
const initialToken = localStorage.getItem("token");
const initialUniqueId = localStorage.getItem("uniqueId"); // uniqueId'yi de localStorage'dan oku

if (initialToken && initialUniqueId) {
  setAuthHeaders(initialToken, initialUniqueId); // Her ikisi de varsa header'ları ayarla
} else {
  // Eğer biri eksikse, tutarlılık için ikisini de temizleyebiliriz.
  // Bu, sadece token varken ama uniqueId yokken (veya tam tersi) bir durum oluşmasını engeller.
  setAuthHeaders(null, null); // Header'ları ve localStorage'ı temizle
}

// API request functions
export const fetchCities = async () => {
  try {
    // console.log("fetchCities API çağrısı yapılıyor..."); // Bu log isteğe bağlı, şimdilik bırakabiliriz
    const response = await api.get(endpoints.cities);
    // console.log("Şehirler API yanıtı (orijinal):", response); // Bu log da isteğe bağlı
    return handleApiResponse(response, "cityList");
  } catch (error) {
    console.error("fetchCities genel API hatası:", error.message || error);
    return []; // Maintain current behavior of returning empty array on catch
  }
};

export const fetchDistricts = async (cityId) => {
  try {
    // console.log(`fetchDistricts API çağrısı yapılıyor... cityId: ${cityId}`);
    const response = await api.get(`${endpoints.districts}?cityId=${cityId}`);
    // console.log("İlçeler API yanıtı (orijinal):", response);
    return handleApiResponse(response, "districtList");
  } catch (error) {
    console.error(
      `fetchDistricts genel API hatası (cityId: ${cityId}):`,
      error.message || error
    );
    return []; // Maintain current behavior
  }
};

export const fetchIndustrialZones = async () => {
  try {
    // console.log("fetchIndustrialZones API çağrısı yapılıyor...");
    const response = await api.get(endpoints.industrialZones);
    // console.log("Sanayi bölgeleri API yanıtı (orijinal):", response);
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
    // console.log(`fetchIndustrialSites API çağrısı yapılıyor... districtId: ${districtId}, cityId: ${cityId}`);
    const queryParams = {};
    if (districtId) queryParams.districtId = districtId;
    if (cityId) queryParams.cityId = cityId;

    // console.log("API çağrısı URL (fetchIndustrialSites) params:", queryParams);
    const response = await api.get(endpoints.industrialSites, {
      params: queryParams,
    });
    // console.log("Sanayi siteleri API yanıtı (orijinal):", response);
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
    // console.log(`fetchRestaurants API çağrısı yapılıyor... districtId: ${districtId}, cityId: ${cityId}`);
    const queryParams = {};
    if (districtId) queryParams.districtId = districtId;
    if (cityId) queryParams.cityId = cityId;

    // console.log("API çağrısı URL (fetchRestaurants) params:", queryParams);
    const response = await api.get(endpoints.restaurants, {
      params: queryParams,
    });
    // console.log("Restoranlar API yanıtı (orijinal):", response);
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
    // console.log("registerUser API çağrısı (credentials):", userData);
    const response = await api.post(endpoints.register, userData);
    // console.log("Kullanıcı kaydı API yanıtı (orijinal):", response);

    // Hata durumlarını kontrol et
    if (response.data.error || response.data.status >= 400) {
      const apiError = new Error(
        response.data.message || "Kayıt sırasında sunucuda bir hata oluştu."
      );
      apiError.isOperational = true; // API'den gelen bilinen bir hata olduğunu belirtmek için (isteğe bağlı)
      throw apiError;
    }

    if (response.data.errors && typeof response.data.errors === "object") {
      // console.error("API validasyon hataları:", response.data.errors);
      const validationError = new Error(
        "Formda validasyon hataları bulundu."
      );
      validationError.fieldErrors = response.data.errors; // Alan bazlı hataları doğrudan ekle
      validationError.isValidationError = true;
      throw validationError;
    }
    return response.data; // Başarılı yanıt
  } catch (error) {
    if (error.isValidationError || error.isOperational) {
      throw error; // Kendi fırlattığımız bilinen hataları tekrar fırlat
    }
    // Axios hatası veya diğer beklenmedik hatalar
    if (error.response && error.response.data) {
      console.error(
        "registerUser - API Hata Yanıtı (Detaylı):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Kayıt sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      // Eğer error.response.data.errors varsa ve henüz fieldErrors olarak set edilmemişse, buraya ekleyebiliriz.
      // Ancak yukarıdaki blok bunu zaten yakalamalı.
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
    // console.log("loginUser API çağrısı (credentials):", credentials);
    const response = await api.post(endpoints.login, credentials);
    // console.log("Kullanıcı girişi API yanıtı (orijinal):", response);

    // Hata durumlarını kontrol et
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
    return response.data; // Başarılı yanıt
  } catch (error) {
    if (error.isValidationError || error.isOperational) {
      throw error; // Kendi fırlattığımız bilinen hataları tekrar fırlat
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
    // console.log("verifyUserToken API çağrısı (token):", token);
    const response = await api.post(endpoints.verifyToken, { token });
    // console.log("Token doğrulama API yanıtı (orijinal):", response);

    // Hata durumlarını kontrol et
    if (response.data.error || response.data.status >= 400) {
      const apiError = new Error(
        response.data.message || "Token doğrulama sırasında bir hata oluştu."
      );
      apiError.isOperational = true;
      throw apiError;
    }

    return response.data; // Başarılı yanıt
  } catch (error) {
    if (error.isOperational) {
      throw error; // Kendi fırlattığımız hataları tekrar fırlat
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
    // console.log(`fetchLocaleCompanies API çağrısı yapılıyor... cityId: ${cityId}, districtId: ${districtId}, industrialSiteId: ${industrialSiteId}`);
    const queryParams = {};
    if (cityId) queryParams.cityId = cityId;
    if (districtId) queryParams.districtId = districtId;
    if (industrialSiteId) queryParams.industrialSiteId = industrialSiteId;

    // console.log("API çağrısı URL (fetchLocaleCompanies) params:", queryParams);
    const response = await api.get(endpoints.findLocaleCompany, {
      params: queryParams,
    });
    // console.log("Yerel firmalar API yanıtı (orijinal):", response);
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
    // console.log(`fetchRestaurantMeals API çağrısı yapılıyor... restaurantId: ${restaurantId}`);

    // Kullanıcı bilgilerini localStorage'dan al (token zaten api instance tarafından yönetiliyor olmalı)
    const userJson = localStorage.getItem("user");
    // const token = localStorage.getItem("token"); // Token'ı buradan almak yerine api instance'ına güvenelim

    // if (!token) { // Bu kontrol de api instance'ı tokenı yönetiyorsa gereksiz olabilir,
    //               // veya sunucu token yoksa zaten 401/403 dönecektir.
    //   console.error("Token bulunamadı! Kullanıcı giriş yapmamış olabilir.");
    //   throw new Error("Oturum açmanız gerekiyor");
    // }

    // console.log("Token bulundu (fetchRestaurantMeals içinde kontrol amaçlı):", token);

    let user = null;
    let uniqueId = null;

    try {
      if (userJson) {
        user = JSON.parse(userJson);
        uniqueId = user.uniqueId || user.unique_id || user.id;
        // console.log("User bilgileri (fetchRestaurantMeals):", user);
        // console.log("UniqueId (fetchRestaurantMeals):", uniqueId);
      }
    } catch (parseError) {
      console.error(
        "Kullanıcı bilgileri parse edilemedi (fetchRestaurantMeals):",
        parseError
      );
      // uniqueId null kalacak, bu durumda header'a eklenmeyecek
    }

    const requestHeaders = {};
    if (uniqueId) {
      requestHeaders["uniqueId"] = uniqueId;
    }

    const queryParams = {};
    if (restaurantId) {
      queryParams.restaurantId = restaurantId;
    }

    // console.log("API isteği (fetchRestaurantMeals) URL endpoint:", endpoints.getMealsWithRestaurantId);
    // console.log("API isteği (fetchRestaurantMeals) params:", queryParams);
    // console.log("API isteği (fetchRestaurantMeals) headers:", requestHeaders);

    const response = await api.get(endpoints.getMealsWithRestaurantId, {
      params: queryParams,
      headers: requestHeaders,
    });

    // console.log("Restoran Yemekleri API yanıtı (orijinal):", response);
    // console.log("API yanıtının tamamı (fetchRestaurantMeals):", JSON.stringify(response.data, null, 2));

    // API yanıtı yapısını inceleme (Bu log geliştirme için faydalı olabilir, şimdilik kalsın)
    console.log("Restoran Yemekleri API yanıtı veri yapısı:", {
      isArray: Array.isArray(response.data),
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      dataKeys: response.data ? Object.keys(response.data) : [], // response.data null/undefined kontrolü eklendi
    });

    // --- Yanıt işleme mantığına dokunulmadı ---
    if (response.data) {
      if (response.data.error === true) {
        console.log(
          "API yanıtı hata içeriyor (fetchRestaurantMeals):",
          response.data.message
        );
        throw new Error(response.data.message || "Yemekler alınamadı");
      }
      if (response.data.mealList && Array.isArray(response.data.mealList)) {
        // console.log("Yemekler, response.data.mealList içinde bulundu (fetchRestaurantMeals):", response.data.mealList.length);
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
    // --- Bitiş: Yanıt işleme mantığına dokunulmadı ---
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
        // headers: error.response.headers, // Genellikle gereksiz
      });
    }
    throw new Error(error.message || "Yemekler alınamadı");
  }
};

// Yeni eklenen API çağrı fonksiyonları

/**
 * Aktif yemek kategorilerini getirir.
 * @returns {Promise<Array>} Kategori listesi veya hata durumunda boş dizi.
 */
export const fetchMealCategories = async () => {
  try {
    const response = await api.get(endpoints.getCategories);
    // handleApiResponse, categoryList anahtarını ve isActive filtresini dikkate almalı
    // Şimdilik, isActive filtresini burada uygulayalım.
    const categories = handleApiResponse(response, "categoryList");
    if (Array.isArray(categories)) {
      return categories.filter(category => category.isActive === "1");
    }
    return []; // handleApiResponse zaten [] dönebilir, ama ekstra kontrol
  } catch (error) {
    console.error("fetchMealCategories API hatası:", error.message || error);
    return [];
  }
};

/**
 * Belirli bir kategoriye ait yemek şablonlarını (ana liste) getirir.
 * Modal'da yemek adı önerileri için kullanılır.
 * @param {number | string} categoryId Kategori ID'si (0 tüm kategoriler için).
 * @returns {Promise<Array>} Yemek şablonları listesi veya hata durumunda boş dizi.
 */
export const fetchMealTemplatesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`${endpoints.getMealMenu}?categoryId=${categoryId}`);
    const meals = handleApiResponse(response, "data"); // API yanıtı 'data' anahtarı altında
    if (Array.isArray(meals)) {
      return meals.map(meal => ({
        ...meal,
        // categoryId string gelebilir, sayıya çeviriyoruz. id zaten genelde sayıdır.
        categoryId: meal.categoryId ? parseInt(meal.categoryId, 10) : null,
        id: meal.id ? parseInt(meal.id, 10) : null
      }));
    }
    return [];
  } catch (error)
{
    console.error(`fetchMealTemplatesByCategory API hatası (categoryId: ${categoryId}):`, error.message || error);
    return [];
  }
};

/**
 * Belirli bir restoranın menüsündeki mevcut yemekleri getirir.
 * @param {string | number} restaurantId Restoran ID'si.
 * @returns {Promise<Array>} Restoranın menü öğeleri (kategorilere göre gruplanmış) veya hata durumunda boş dizi.
 */
export const fetchRestaurantMenu = async (restaurantId) => {
  try {
    const response = await api.get(`${endpoints.getMealsWithRestaurantId}?restaurantId=${restaurantId}`);
    // API yanıtı 'mealList' anahtarı altında ve içinde meals->categoryId string
    const mealListByCategory = handleApiResponse(response, "mealList");

    if (Array.isArray(mealListByCategory)) {
      // Her bir kategorideki yemeklerin categoryId ve quantity değerlerini parse edelim.
      return mealListByCategory.map(categoryGroup => ({
        ...categoryGroup,
        // categoryGroup.categoryId zaten sayısal geliyor API'den (getMealsWithRestaurantId)
        meals: Array.isArray(categoryGroup.meals) ? categoryGroup.meals.map(meal => ({
          ...meal,
          categoryId: meal.categoryId ? parseInt(meal.categoryId, 10) : null,
          quantity: meal.quantity ? parseInt(meal.quantity, 10) : 0, // Stok yoksa 0
          // id (yemeğin restorandaki id'si) zaten sayısal geliyor
        })) : [],
      }));
    }
    return [];
  } catch (error) {
    console.error(`fetchRestaurantMenu API hatası (restaurantId: ${restaurantId}):`, error.message || error);
    return [];
  }
};

/**
 * Bir yemeği restoran menüsüne ekler.
 * @param {{ mealMenuId: string, quantity: string, restaurantId: string }} mealData Eklenecek yemek bilgileri.
 * @returns {Promise<object>} API yanıtı (başarı/hata durumu ve mesajı içermeli).
 */
export const addRestaurantMeal = async (mealData) => {
  try {
    // endpoint'i kontrol et, api.txt'de /addMealForRestaurant olarak geçiyor
    const response = await api.post("/addMealForRestaurant", mealData);
    // API yanıtının yapısına göre (api.txt'deki örnekler):
    // Başarılı yanıt: { status: 201, error: false, message: "... eklendi", data: { meal: {...}, stock: {...} } }
    // Hatalı yanıt: { status: 400, error: true, message: "...", errors: {...} }
    return response.data; // Tüm yanıtı döndür, component tarafında error/success kontrolü yapılsın
  } catch (error) {
    console.error("addRestaurantMeal API hatası:", error.response?.data || error.message || error);
    // Hata durumunda da API'den gelen yanıtı (eğer varsa) veya genel bir hata objesi döndür
    if (error.response && error.response.data) {
      return error.response.data; // API'nin hata yapısını component'a ilet
    }
    return {
      error: true,
      message: error.message || "Yemek eklenirken bilinmeyen bir hata oluştu.",
    };
  }
};
