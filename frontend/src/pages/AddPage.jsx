import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addEquipment } from "../services/api";

function AddPage() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		nom: "",
		modele: "nouveau",
		description: "",
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
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
		setError("");
		setSuccess("");

		if (!form.nom.trim()) {
			setError("Le nom est obligatoire.");
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
			setError(err.message || "Impossible d'ajouter l'equipement.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Ajouter un equipement</h1>

			<form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "460px" }}>
				<label>
					Nom
					<input
						type="text"
						name="nom"
						value={form.nom}
						onChange={handleChange}
						required
					/>
				</label>

				<label>
					Modele
					<select name="modele" value={form.modele} onChange={handleChange}>
						<option value="nouveau">nouveau</option>
						<option value="ancien">ancien</option>
						<option value="refait">refait</option>
					</select>
				</label>

				<label>
					Description
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						rows={4}
					/>
				</label>

				<label>
					Image (optionnel)
					<input type="file" name="image" accept="image/*" onChange={handleChange} />
				</label>

				<button type="submit" disabled={loading}>
					{loading ? "Envoi..." : "Ajouter"}
				</button>
			</form>

			{error && <p style={{ color: "red" }}>Erreur: {error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}

			<div style={{ display: "flex", gap: "12px" }}>
				<button type="button" onClick={() => navigate("/equipments")}>Retour liste</button>
				<Link to="/login">Aller au login</Link>
			</div>
		</div>
	);
}

export default AddPage;
