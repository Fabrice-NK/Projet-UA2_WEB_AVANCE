import api from "./api";

export const getSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
};

export const createSubject = async (formData) => {
  const response = await api.post("/subjects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateSubject = async (id, payload) => {
  const response = await api.put(`/subjects/${id}`, payload);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};
