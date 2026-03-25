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



// Créer une instance d'axios avec une URL de base
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;