import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";


// Ce fichier configure le store Redux pour l'application, en combinant les reducers nécessaires (actuellement uniquement authReducer) et en appliquant les middlewares par défaut de Redux Toolkit.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});