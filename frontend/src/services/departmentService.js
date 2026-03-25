import api from "./api";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

export const createDepartment = async (formData) => {
  const response = await api.post("/departments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateDepartment = async (id, payload) => {
  const response = await api.put(`/departments/${id}`, payload);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};
