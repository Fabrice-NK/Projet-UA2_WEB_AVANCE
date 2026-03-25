import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";



// Ce fichier gère l'état d'authentification de l'utilisateur, en utilisant Redux Toolkit pour créer un slice avec des actions et des reducers. Il inclut une action asynchrone pour la connexion de l'utilisateur, qui communique avec l'API backend pour obtenir un token d'authentification.

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/login", credentials);
      const token = response?.data?.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Token de connexion manquant");
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Échec de connexion"
      );
    }
  }
);

const persistedToken = localStorage.getItem("token");
const validToken =
  persistedToken && persistedToken !== "undefined" && persistedToken !== "null"
    ? persistedToken
    : null;

if (!validToken) {
  localStorage.removeItem("token");
}

const initialState = {
  token: validToken,
  isAuthenticated: !!validToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Connexion impossible";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;