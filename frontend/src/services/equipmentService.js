import api from "./api";

export const getEquipmentList = async () => {
  const response = await api.get("/equipment");
  return response.data;
};

export const getEquipmentById = async (id) => {
  const response = await api.get(`/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (formData) => {
  const response = await api.post("/equipment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEquipment = async (id, payload) => {
  const response = await api.put(`/equipment/${id}`, payload);
  return response.data;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/equipment/${id}`);
  return response.data;
};
