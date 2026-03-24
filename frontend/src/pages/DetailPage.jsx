import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteItem, getItemById, updateItem } from "../services/api";

function DetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [item, setItem] = useState(null);
	const [form, setForm] = useState({ nom: "", modele: "nouveau", description: "" });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const loadItem = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getItemById(id);
			setItem(data);
			setForm({
				nom: data?.nom ?? "",
				modele: data?.modele ?? "nouveau",
				description: data?.description ?? "",
			});
		} catch (err) {
			setError(err.message || "Impossible de charger l'element.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadItem();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setSuccess("");
		setError("");

		if (!form.nom.trim()) {
			setError("Le nom est obligatoire.");
			return;
		}

		try {
			setSaving(true);
			await updateItem(id, {
				nom: form.nom,
				modele: form.modele,
				description: form.description,
			});
			setSuccess("Modification enregistree.");
			await loadItem();
		} catch (err) {
			setError(err.message || "Echec de la modification.");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		setSuccess("");
		setError("");
		const confirmed = window.confirm("Supprimer cet equipement ?");
		if (!confirmed) {
			return;
		}

		try {
			setDeleting(true);
			await deleteItem(id);
			navigate("/equipments");
		} catch (err) {
			setError(err.message || "Echec de la suppression.");
		} finally {
			setDeleting(false);
		}
	};

	if (loading) return <p>Chargement...</p>;
	if (!item) return <p>Element introuvable.</p>;

	return (
		<div>
			<h1>Detail</h1>

			<p>ID: {item.id}</p>

			<form onSubmit={handleUpdate} style={{ display: "grid", gap: "10px", maxWidth: "460px" }}>
				<label>
					Nom
					<input type="text" name="nom" value={form.nom} onChange={handleChange} required />
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
					<textarea name="description" value={form.description} onChange={handleChange} rows={4} />
				</label>

				<div style={{ display: "flex", gap: "10px" }}>
					<button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Mettre a jour"}</button>
					<button type="button" onClick={handleDelete} disabled={deleting}>
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</form>

			{error && <p style={{ color: "red" }}>Erreur: {error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}

			<p>
				<Link to="/equipments">Retour a la liste</Link>
			</p>
		</div>
	);
}

export default DetailPage;
