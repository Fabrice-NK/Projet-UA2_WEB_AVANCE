import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addEquipment } from "../services/api";
import { validateAddPageForm } from "../helpers/validation";

function AddPage() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		nom: "",
		modele: "nouveau",
		description: "",
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "image") {
			setForm((prev) => ({ ...prev, image: files?.[0] ?? null }));
			return;
		}

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		setSuccess("");

		const validationErrors = validateAddPageForm(form.nom, form.description, form.image);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const body = new FormData();
		body.append("nom", form.nom);
		body.append("modele", form.modele);
		body.append("description", form.description);
		if (form.image) {
			body.append("image", form.image);
		}

		try {
			setLoading(true);
			await addEquipment(body);
			setSuccess("Equipement ajoute avec succes.");
			setTimeout(() => navigate("/equipments"), 700);
		} catch (err) {
			setErrors({ submit: err.message || "Impossible d'ajouter l'equipement." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<h1 className="mb-3">Ajouter un equipement</h1>

			{success && <div className="alert alert-success">{success}</div>}
			{errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

			<form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: "500px" }}>
				<div className="mb-3">
					<label className="form-label">Nom *</label>
					<input
						type="text"
						name="nom"
						value={form.nom}
						onChange={handleChange}
						className={`form-control ${errors.nom ? "is-invalid" : ""}`}
						placeholder="Entrez le nom"
					/>
					{errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">Modele</label>
					<select name="modele" value={form.modele} onChange={handleChange} className="form-control">
						<option value="nouveau">nouveau</option>
						<option value="ancien">ancien</option>
						<option value="refait">refait</option>
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">Description</label>
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						rows={4}
						className={`form-control ${errors.description ? "is-invalid" : ""}`}
						placeholder="Entrez la description"
					/>
					{errors.description && <div className="invalid-feedback">{errors.description}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">Image (optionnel)</label>
					<input
						type="file"
						name="image"
						accept="image/*"
						onChange={handleChange}
						className={`form-control ${errors.image ? "is-invalid" : ""}`}
					/>
					{errors.image && <div className="invalid-feedback">{errors.image}</div>}
				</div>

				<button type="submit" disabled={loading} className="btn btn-primary">
					{loading ? "Envoi..." : "Ajouter"}
				</button>
				<Link to="/equipments" className="btn btn-secondary ms-2">
					Annuler
				</Link>
			</form>
		</div>
	);
}

export default AddPage;
