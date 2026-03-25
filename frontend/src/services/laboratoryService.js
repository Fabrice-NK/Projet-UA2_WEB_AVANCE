import api from "./api";

export const getLaboratories = async () => {
  const response = await api.get("/laboratories");
  return response.data;
};

export const getLaboratoryById = async (id) => {
  const response = await api.get(`/laboratories/${id}`);
  return response.data;
};

export const createLaboratory = async (formData) => {
  const response = await api.post("/laboratories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateLaboratory = async (id, formData) => {
  const response = await api.put(`/laboratories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteLaboratory = async (id) => {
  const response = await api.delete(`/laboratories/${id}`);
  return response.data;
};

export const getLaboratoryEquipment = async (id) => {
  const response = await api.get(`/laboratories/${id}/equipment`);
  return response.data;
};