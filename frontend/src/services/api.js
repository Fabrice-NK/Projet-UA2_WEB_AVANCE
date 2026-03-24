const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

// AUTH
export const loginUser = async (email, mot_de_passe) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `Erreur API: ${response.status}`);
    }

    const payload = await response.json();
    return payload; // { data: user, token }
};

// EQUIPEMENTS
export const getEquipments = async () => {
    const response = await fetch(`${BASE_URL}/equipment`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    const payload = await response.json();
    return payload?.data?.equipments ?? [];
};

export const getEquipmentById = async (id) => {
    const response = await fetch(`${BASE_URL}/equipment/${id}`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    const payload = await response.json();
    return payload?.data ?? null;
};

export const addEquipment = async (formData) => {
    const response = await fetch(`${BASE_URL}/equipment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` }, // pas de Content-Type pour FormData
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `Erreur API: ${response.status}`);
    }

    return response.json();
};

export const deleteEquipment = async (id) => {
    const response = await fetch(`${BASE_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    return response.json();
};