const BASE_URL = "http://localhost:5000/api";

export const getData = async () => {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    const payload = await response.json();
    return payload?.data?.users ?? [];
};