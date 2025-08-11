import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAuthHeaders,
  registerUser,
  loginUser,
  verifyUserToken,
} from "@/utils/api";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);

      if (!response.error && (response.status === 200 || response.status === 201)) {
        // No auto-login after registration; return a success message only.
        return { message: response.message || "Kayıt işlemi başarılı" };
      } else {
        return rejectWithValue({
          message:
            response.message ||
            "Kayıt işlemi API tarafından başarısız olarak işaretlendi",
        });
      }
    } catch (error) {
      // Preserve validation errors (RegisterPage.jsx expects this shape)
      if (error.isValidationError) {
        return rejectWithValue({
          isValidationError: true,
          fieldErrors: error.fieldErrors,
          message: error.message || "Formda validasyon hataları bulundu.",
        });
      }
      // Operational or generic error
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          "Kayıt işlemi sırasında bir hata oluştu",
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      if (!response.error && response.user) {
        const user = response.user;
        const token = user?.token;
        const uniqueId = user?.uniqueId;

        if (!token) {
          return rejectWithValue("Token bulunamadı");
        }
        if (!uniqueId) {
          return rejectWithValue("Kullanıcı UniqueId bulunamadı");
        }
        setAuthHeaders(token, uniqueId);
        localStorage.setItem("user", JSON.stringify(user));
        return { user, token };
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

      const response = await verifyUserToken();

      if (!response.error && response.user) {
        const prevUser = getState().auth.user;
        const mergedUser = { ...(prevUser || {}), ...response.user };

        localStorage.setItem("user", JSON.stringify(mergedUser));

        // Sadece geçerli değerler geldiğinde auth header'larını güncelle
        if (response.user.token && response.user.uniqueId) {
          setAuthHeaders(response.user.token, response.user.uniqueId);
        }

        const nextToken = response.user.token || token;

        return {
          user: mergedUser,
          token: nextToken,
        };
      } else {
        setAuthHeaders(null, null);
        return rejectWithValue(
          response.message || "Token doğrulaması başarısız oldu"
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

// Helper: reset auth state
const resetAuthState = (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      resetAuthState(state);
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
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
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

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
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        resetAuthState(state);
        state.error = action.payload;
      });

    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        resetAuthState(state);
        state.error = action.payload;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    setAuthHeaders(null, null);
    dispatch(authSlice.actions.clearAuth());
  }
);

export default authSlice.reducer;
