import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (formData) => {
  const response = await api.post("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
