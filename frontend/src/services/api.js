// const BASE_URL = "http://localhost:5000/api";

// export const getData = async () => {
//     const response = await fetch(`${BASE_URL}/users`);

//     if (!response.ok) {
//         throw new Error(`Erreur API: ${response.status}`);
//     }

//     const payload = await response.json();
//     return payload?.data?.users ?? [];
// };


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Injecter le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rediriger vers /login si le serveur répond 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;