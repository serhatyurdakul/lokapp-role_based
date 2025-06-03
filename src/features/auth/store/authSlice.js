import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  api,
  setAuthHeaders,
  registerUser,
  loginUser,
  verifyUserToken,
} from "@/utils/api";

// const API_URL = "https://emreustaa.com/public/api";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // registerUser fonksiyonu response.data dır
      const response = await registerUser(userData);

      if (
        !response.error &&
        (response.status === 200 || response.status === 201)
      ) {
        // kullanıcı kaydı (registerUser)
        // Token ve uniqueId içeren user nesnesi bekleniyor.
        if (response.user && response.user.uniqueId && response.user.token) {
          const token = response.user.token;
          const user = response.user;
          return {
            user,
            token,
          };
        } else {
          return rejectWithValue(
            response.message ||
              "Kullanıcı kayıt verisi eksik veya hatalı (uniqueId/token)"
          );
        }
      } else {
        return rejectWithValue(
          response.message ||
            "Kayıt işlemi API tarafından başarısız olarak işaretlendi"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Kayıt işlemi sırasında bir hata oluştu"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      if (!response.error || (response.user && response.user.token)) {
        let token;
        let user;
        if (response.user && response.user.token) {
          token = response.user.token;
          user = response.user;
        } else if (response.token) {
          token = response.token;
          user = response.user;
        } else {
          return rejectWithValue("Token bulunamadı");
        }

        if (user && user.uniqueId) {
          setAuthHeaders(token, user.uniqueId);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.error("Login yanıtında user.uniqueId bulunamadı!", user);
          return rejectWithValue("Kullanıcı UniqueId bulunamadı");
        }
        return {
          user,
          token,
        };
      } else {
        return rejectWithValue(
          response.message || "Giriş işlemi başarısız oldu"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Giriş işlemi sırasında bir hata oluştu"
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue("Doğrulanacak token bulunamadı (state)");
      }

      const response = await verifyUserToken(token);

      if (!response.error && response.user) {
        if (response.user.uniqueId) {
          localStorage.setItem("user", JSON.stringify(response.user));
        } else {
          console.warn("verifyToken yanıtında user.uniqueId eksik.");
        }
        return {
          user: response.user,
        };
      } else {
        setAuthHeaders(null, null);
        return rejectWithValue(
          response.data.message || "Token doğrulaması başarısız oldu"
        );
      }
    } catch (error) {
      setAuthHeaders(null, null);
      return rejectWithValue(
        error.response?.data?.message ||
          "Token doğrulaması sırasında bir hata oluştu"
      );
    }
  }
);

const initialState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
  isAuthenticated:
    !!localStorage.getItem("token") && !!localStorage.getItem("uniqueId"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      setAuthHeaders(null, null);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.registrationMessage =
          "Kayıt işleminiz başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.registrationMessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.registrationMessage = null;
      });

    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationMessage = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.registrationMessage = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.registrationMessage = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
