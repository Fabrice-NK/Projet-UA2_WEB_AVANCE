import api from "./api";

// 🔹 Récupérer tous les laboratoires
export const getLaboratories = async () => {
  const response = await api.get("/laboratories");
  return response.data.data || []; // toujours un tableau
};

// 🔹 Récupérer un laboratoire par ID
export const getLaboratoryById = async (id) => {
  const response = await api.get(`/laboratories/${id}`);
  return response.data.data || response.data; // selon backend
};

// 🔹 Créer un laboratoire
export const createLaboratory = async (formData) => {
  const response = await api.post("/laboratories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data || response.data;
};

// 🔹 Modifier un laboratoire
export const updateLaboratory = async (id, formData) => {
  const response = await api.put(`/laboratories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data || response.data;
};

// 🔹 Supprimer un laboratoire
export const deleteLaboratory = async (id) => {
  const response = await api.delete(`/laboratories/${id}`);
  return response.data;
};

// 🔹 Récupérer les équipements d’un laboratoire
export const getLaboratoryEquipment = async (id) => {
  const response = await api.get(`/laboratories/${id}/equipment`);
  return response.data.data || [];
};