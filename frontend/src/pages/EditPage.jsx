import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, updateItem } from "../services/api";

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nom, setNom] = useState("");
    const [modele, setModele] = useState("nouveau");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getItemById(id)
            .then((data) => {
                setNom(data?.nom ?? data?.name ?? "");
                setModele(data?.modele ?? "nouveau");
                setDescription(data?.description ?? "");
            })
            .catch((err) => setError(err.message || "Erreur de chargement"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateItem(id, { nom, modele, description });
            navigate("/equipments");
        } catch (err) {
            setError(err.message || "Erreur de mise a jour");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <h1>Modifier</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "460px" }}>
                <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required />

                <select value={modele} onChange={(e) => setModele(e.target.value)}>
                    <option value="nouveau">nouveau</option>
                    <option value="ancien">ancien</option>
                    <option value="refait">refait</option>
                </select>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={4}
                />

                <button type="submit">Modifier</button>
            </form>
        </div>
    );
}

export default EditPage;
