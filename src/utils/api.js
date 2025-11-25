import axios from "axios";
import logger from "@/utils/logger";
import {
  MSG_NETWORK_ERROR,
  MSG_TIMEOUT_ERROR,
  MSG_UNKNOWN_ERROR,
} from "@/constants/messages";

// API URL
const { VITE_API_BASE_URL } = import.meta.env;

if (!VITE_API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined. Please set it in your environment variables (.env.*)"
  );
}

const API_BASE_URL = VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios auth interceptors
// Logs out if token is invalid or used elsewhere

// Logout handler is injected from the store to avoid circular imports.
let logoutHandler = null;
export const setLogoutHandler = (fn) => {
  logoutHandler = typeof fn === "function" ? fn : null;
};

// Axios response & error interceptor
api.interceptors.response.use(
  (response) => {
    if (response?.data?.tokenError === true) {
      logoutHandler?.();
    }
    return response;
  },
  (error) => {
    // 401 → invalid session
    if (error?.response?.status === 401) {
      logoutHandler?.();
    }

    // Network error / CORS issue
    if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      (!error.response && error.request)
    ) {
      return Promise.reject(new Error(MSG_NETWORK_ERROR));
    }

    // Timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error(MSG_TIMEOUT_ERROR));
    }

    // Preserve backend message if provided
    if (error.response && error.response.data?.message) {
      return Promise.reject(error);
    }

    // Unknown error
    return Promise.reject(new Error(MSG_UNKNOWN_ERROR));
  }
);

// Parses API response
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
        logger.warn(
          "Expected data not found in API response (handleApiResponse):",
          data.message
        );
      } else {
        logger.error(
          "Error in API response (handleApiResponse):",
          data.message
        );
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

    logger.warn(
      "API response is not in the expected array format or contains no data (handleApiResponse):",
      data
    );
    return [];
  }

  logger.error("Invalid or empty API response (handleApiResponse):", response);
  return [];
};

export const endpoints = {
  register: "/registerUser",
  login: "/loginUser",
  verifyToken: "/verifyToken",

  cities: "/cities",
  districts: "/districts",
  industrialSites: "/getIndustrialSites",
  restaurants: "/restaurants",
  findLocaleCompany: "/findLocaleCompany",
  getMealsWithRestaurantId: "/getMealsWithRestaurantId",
  getCategories: "/getCategories",
  getMealMenu: "/getMealMenu",
  addMealForRestaurant: "/addMealForRestaurant",
  updateMealForRestaurant: "/updateMealForRestaurant",
  deleteMealFromRestaurant: "/deleteMealFromRestaurant",
  createOrder: "/createOrder",
  getRestaurantsOrderList: "/getRestaurantsOrderList",
  getRestaurantOrderDetails: "/getRestaurantOrderDetails",
  getRestaurantInfo: "/getRestaurantInfo",
  setOrderStatus: "/setOrderStatus",
  getOrderHistoryByUser: "/getOrderHistoryByUser",
};

// Auth helpers
export const setAuthHeaders = (token, uniqueId) => {
  if (token && uniqueId) {
    localStorage.setItem("token", token);
    localStorage.setItem("uniqueId", uniqueId);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api.defaults.headers.common["uniqueId"] = uniqueId;
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("uniqueId");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["uniqueId"];
  }
};

const initialToken = localStorage.getItem("token");
const initialUniqueId = localStorage.getItem("uniqueId");

if (initialToken && initialUniqueId) {
  setAuthHeaders(initialToken, initialUniqueId);
} else {
  setAuthHeaders(null, null);
}

export const fetchCities = async () => {
  try {
    const response = await api.get(endpoints.cities);
    if (response?.data?.error === true) {
      const msg = response.data.message || "Şehirler yüklenemedi";
      if (
        msg.includes("listesi bulunamadı") ||
        msg.includes("liste bulunamadı")
      ) {
        return [];
      }
      throw new Error(msg);
    }
    return handleApiResponse(response, "cityList");
  } catch (error) {
    logger.error("fetchCities general API error:", error.message || error);
    throw new Error(error.message || "Şehirler yüklenemedi");
  }
};

export const fetchDistricts = async (cityId) => {
  try {
    const response = await api.get(endpoints.districts, {
      params: { cityId },
    });
    if (response?.data?.error === true) {
      const msg = response.data.message || "İlçeler yüklenemedi";
      if (
        msg.includes("listesi bulunamadı") ||
        msg.includes("liste bulunamadı")
      ) {
        return [];
      }
      throw new Error(msg);
    }
    return handleApiResponse(response, "districtList");
  } catch (error) {
    logger.error(
      `fetchDistricts general API error (cityId: ${cityId}):`,
      error.message || error
    );
    throw new Error(error.message || "İlçeler yüklenemedi");
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
    if (response?.data?.error === true) {
      const msg = response.data.message || "Sanayi siteleri yüklenemedi";
      if (
        msg.includes("listesi bulunamadı") ||
        msg.includes("liste bulunamadı")
      ) {
        return [];
      }
      throw new Error(msg);
    }
    return handleApiResponse(response, "industrialSiteList");
  } catch (error) {
    logger.error(
      `fetchIndustrialSites general API error (districtId: ${districtId}, cityId: ${cityId}):`,
      error.message || error
    );
    throw new Error(error.message || "Sanayi siteleri yüklenemedi");
  }
};

// Fetch detailed restaurant info
export const fetchRestaurantInfo = async (restaurantId) => {
  try {
    if (!restaurantId) {
      throw new Error("restaurantId zorunludur");
    }

    const response = await api.get(endpoints.getRestaurantInfo, {
      params: { restaurantId },
    });

    if (response?.data?.error) {
      throw new Error(response.data.message || "Restoran bulunamadı");
    }

    if (response?.data?.restaurant) {
      return response.data.restaurant;
    }

    throw new Error("Beklenmeyen API formatı");
  } catch (error) {
    logger.error(
      `fetchRestaurantInfo API error (restaurantId: ${restaurantId}):`,
      error.response?.data || error.message || error
    );
    throw new Error(error.message || "Restoran bilgileri alınamadı");
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
    if (response?.data?.error === true) {
      const msg = response.data.message || "Restoranlar yüklenemedi";
      if (
        msg.includes("listesi bulunamadı") ||
        msg.includes("liste bulunamadı")
      ) {
        return [];
      }
      throw new Error(msg);
    }
    return handleApiResponse(response, "restaurantList");
  } catch (error) {
    logger.error(
      `fetchRestaurants general API error (districtId: ${districtId}, cityId: ${cityId}):`,
      error.message || error
    );
    throw new Error(error.message || "Restoranlar yüklenemedi");
  }
};

// Auth request functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post(endpoints.register, userData);

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

    if (error.response && error.response.data) {
      logger.error(
        "registerUser - API Error Response (Detailed):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Kayıt sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    logger.error(
      "User registration general API error:",
      error.message || error
    );
    throw new Error(
      error.message ||
        "Kayıt sırasında bilinmeyen bir ağ hatası veya sunucu hatası oluştu."
    );
  }
};

// Login API call
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(endpoints.login, credentials);

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

    if (error.response && error.response.data) {
      logger.error(
        "loginUser - API Error Response (Detailed):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Giriş sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    logger.error("User login general API error:", error.message || error);
    throw new Error(
      error.message ||
        "Giriş sırasında bilinmeyen bir ağ hatası veya sunucu hatası oluştu."
    );
  }
};

// Verify token
export const verifyUserToken = async () => {
  try {
    const response = await api.post(endpoints.verifyToken);

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

    if (error.response && error.response.data) {
      logger.error(
        "verifyUserToken - API Error Response (Detailed):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Token doğrulama sırasında sunucuda bir hata oluştu.";
      const newError = new Error(message);
      throw newError;
    }
    logger.error(
      "Token verification general API error:",
      error.message || error
    );
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
    if (response?.data?.error === true) {
      const msg = response.data.message || "Firma listesi yüklenemedi";
      if (
        msg.includes("listesi bulunamadı") ||
        msg.includes("liste bulunamadı")
      ) {
        return [];
      }
      throw new Error(msg);
    }
    return handleApiResponse(response, "companyList");
  } catch (error) {
    logger.error(
      `fetchLocaleCompanies general API error (cityId: ${cityId}, districtId: ${districtId}, industrialSiteId: ${industrialSiteId}):`,
      error.message || error
    );
    throw new Error(error.message || "Firma listesi yüklenemedi");
  }
};

// Fetch newly added meals
export const fetchRestaurantMeals = async (restaurantId) => {
  try {
    const queryParams = {};
    if (restaurantId) {
      queryParams.restaurantId = restaurantId;
    }

    const response = await api.get(endpoints.getMealsWithRestaurantId, {
      params: queryParams,
    });

    if (response.data) {
      if (response.data.error === true) {
        logger.error(
          "API response contains error (fetchRestaurantMeals):",
          response.data.message
        );

        if (
          !response.data.mealList ||
          (Array.isArray(response.data.mealList) &&
            response.data.mealList.length === 0)
        ) {
          return [];
        }

        throw new Error(response.data.message || "Yemekler alınamadı");
      }

      if (response.data.mealList && Array.isArray(response.data.mealList)) {
        return response.data.mealList;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }
      logger.error(
        "No properly formatted meal data found in API response (fetchRestaurantMeals):",
        response.data
      );
      return [];
    }
    return [];
  } catch (error) {
    if (error.response) {
      logger.error("API error response (fetchRestaurantMeals):", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else {
      logger.error("Restaurant meals API error (fetchRestaurantMeals):", error);
    }
    throw new Error(error.message || "Yemekler alınamadı");
  }
};

export const fetchMealCategories = async () => {
  try {
    const response = await api.get(endpoints.getCategories);

    const categories = handleApiResponse(response, "categoryList");
    if (Array.isArray(categories)) {
      return categories.filter((category) => category.isActive === "1");
    }
    return [];
  } catch (error) {
    logger.error("fetchMealCategories API error:", error.message || error);
    throw new Error(error.message || "Kategoriler yüklenemedi");
  }
};

export const fetchMealOptionsByCategory = async (categoryId) => {
  try {
    const response = await api.get(endpoints.getMealMenu, {
      params: { categoryId },
    });
    const meals = handleApiResponse(response, "data");
    if (Array.isArray(meals)) {
      return meals.map((meal) => ({
        ...meal,

        categoryId: meal.categoryId ? parseInt(meal.categoryId, 10) : null,
        id: meal.id ? parseInt(meal.id, 10) : null,
      }));
    }
    return [];
  } catch (error) {
    logger.error(
      `fetchMealOptionsByCategory API error (categoryId: ${categoryId}):`,
      error.message || error
    );
    return [];
  }
};

export const fetchRestaurantMenu = async (restaurantId) => {
  try {
    const response = await api.get(endpoints.getMealsWithRestaurantId, {
      params: { restaurantId },
    });
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
              quantity: meal.quantity ? parseInt(meal.quantity, 10) : 0,
              remainingQuantity: meal.remainingQuantity
                ? parseInt(meal.remainingQuantity, 10)
                : 0,
              orderCount: meal.orderCount ? parseInt(meal.orderCount, 10) : 0,
            }))
          : [],
      }));
    }
    return [];
  } catch (error) {
    logger.error(
      `fetchRestaurantMenu API error (restaurantId: ${restaurantId}):`,
      error.message || error
    );
    throw new Error(error.message || "Menü verileri yüklenemedi");
  }
};

export const addRestaurantMeal = async (mealData) => {
  try {
    const response = await api.post(endpoints.addMealForRestaurant, mealData);
    const data = response?.data;

    // If backend signals error in body (even with 2xx), surface it
    if (data && (data.error === true || Number(data.status) >= 400)) {
      // Use only API-provided message
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    logger.error(
      "addRestaurantMeal API error:",
      error.response?.data || error.message || error
    );
    if (error.response && error.response.data) {
      const message = error.response.data.message || error.message;
      throw new Error(message);
    }
    // If the error was intentionally thrown above or by interceptors, preserve it
    if (error instanceof Error && error.message) {
      throw error;
    }
    // Network or no-response case
    if (error.code === "ECONNABORTED") {
      throw new Error(MSG_TIMEOUT_ERROR);
    }
    throw new Error(MSG_NETWORK_ERROR);
  }
};

export const updateMealForRestaurant = async (mealData) => {
  try {
    const response = await api.post(
      endpoints.updateMealForRestaurant,
      mealData
    );
    const data = response?.data;
    if (data && (data.error === true || Number(data.status) >= 400)) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    logger.error(
      "updateMealForRestaurant API error:",
      error.response?.data || error.message || error
    );
    if (error.response && error.response.data) {
      const message = error.response.data.message || error.message;
      throw new Error(message);
    }
    if (error instanceof Error && error.message) {
      throw error;
    }
    // Network or no-response case
    if (error.code === "ECONNABORTED") {
      throw new Error(MSG_TIMEOUT_ERROR);
    }
    throw new Error(MSG_NETWORK_ERROR);
  }
};

export const deleteMealFromRestaurant = async (deleteData) => {
  try {
    const response = await api.post(
      endpoints.deleteMealFromRestaurant,
      deleteData
    );
    const data = response?.data;
    if (data && (data.error === true || Number(data.status) >= 400)) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    logger.error(
      "deleteMealFromRestaurant API error:",
      error.response?.data || error.message || error
    );

    if (error.response && error.response.data) {
      const message = error.response.data.message || error.message;
      throw new Error(message);
    }
    if (error instanceof Error && error.message) {
      throw error;
    }

    // Network or no-response case
    if (error.code === "ECONNABORTED") {
      throw new Error(MSG_TIMEOUT_ERROR);
    }
    throw new Error(MSG_NETWORK_ERROR);
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post(endpoints.createOrder, orderData);

    const responseData = response.data;

    if (responseData.error || responseData.status >= 400) {
      // Use API-provided error message if available
      const message =
        responseData.message || "Sipariş oluşturulurken bir hata oluştu.";
      const apiError = new Error(message);

      // Distinguish token errors
      if (responseData.tokenError) {
        apiError.tokenError = true;
      }
      throw apiError;
    }

    // Return full response on success
    return responseData;
  } catch (error) {
    if (error.isOperational || error.tokenError) {
      throw error;
    }

    // If Axios or network error, create general message
    if (error.response) {
      logger.error(
        "createOrder - API Error Response (Detailed):",
        JSON.stringify(error.response.data, null, 2)
      );
      const message =
        error.response.data.message ||
        "Sipariş oluşturma sırasında sunucuda bir hata oluştu.";
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      logger.error("createOrder - No response received:", error.request);
      throw new Error(
        "Sipariş oluşturulamadı, lütfen daha sonra tekrar deneyin."
      );
    } else {
      logger.error("createOrder - Request setup error:", error.message);
      throw new Error("Sipariş isteği oluşturulurken bir hata oluştu.");
    }
  }
};

export const getRestaurantsOrderList = async (restaurantId, tabId = 0) => {
  try {
    const response = await api.get(endpoints.getRestaurantsOrderList, {
      params: { restaurantId, tabId },
    });

    return response.data;
  } catch (error) {
    logger.error(
      "Restaurant order list API error:",
      error.response?.data || error.message
    );

    if (!error.response) {
      throw error;
    }

    // Use backend message if available, otherwise default
    throw new Error(
      error.response.data?.message || "Sipariş listesi alınamadı."
    );
  }
};

export const fetchUserOrderHistoryByDate = async (year, month, day) => {
  try {
    const response = await api.get(endpoints.getOrderHistoryByUser, {
      params: { year, month, day },
    });
    const data = response?.data;
    if (!data) return [];
    if (data.error === true) {
      // 422 veya benzeri durumlarda boş liste dönüyor olabilir
      return Array.isArray(data.orderList) ? data.orderList : [];
    }
    return Array.isArray(data.orderList) ? data.orderList : [];
  } catch (error) {
    // Ağ ya da diğer hatalarda boş liste
    return [];
  }
};

export const getRestaurantOrderDetails = async (restaurantId, companyId) => {
  try {
    const response = await api.get(endpoints.getRestaurantOrderDetails, {
      params: { restaurantId, companyId },
    });
    return response.data;
  } catch (error) {
    logger.error(
      "Restaurant order detail API error:",
      error.response?.data || error.message
    );

    if (!error.response) {
      throw error;
    }
    throw new Error(
      error.response.data?.message || "Sipariş detayları alınamadı."
    );
  }
};

export const setOrderStatus = async (statusData) => {
  try {
    const response = await api.post(endpoints.setOrderStatus, statusData);
    return response.data;
  } catch (error) {
    logger.error(
      "Order status update API error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Sipariş durumu güncellenemedi."
    );
  }
};
