import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getItemById, updateItem } from "../services/api";
import { validateEditPageForm } from "../helpers/validation";

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nom, setNom] = useState("");
    const [modele, setModele] = useState("nouveau");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setErrors({});
        setError("");
        setSuccess("");

        const validationErrors = validateEditPageForm(nom, description);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            await updateItem(id, { nom, modele, description });
            setSuccess("Equipement modifie avec succes.");
            setTimeout(() => navigate(`/equipments/${id}`), 700);
        } catch (err) {
            setErrors({ submit: err.message || "Impossible de modifier l'equipement." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="container mt-4"><p>Chargement...</p></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Modifier</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

            <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: "500px" }}>
                <div className="mb-3">
                    <label className="form-label">Nom *</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                        placeholder="Entrez le nom"
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Modele</label>
                    <select value={modele} onChange={(e) => setModele(e.target.value)} className="form-control">
                        <option value="nouveau">nouveau</option>
                        <option value="ancien">ancien</option>
                        <option value="refait">refait</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Entrez la description"
                        rows={4}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Modification..." : "Modifier"}
                </button>
                <Link to="/equipments" className="btn btn-secondary ms-2">
                    Annuler
                </Link>
            </form>
        </div>
    );
}

export default EditPage;
