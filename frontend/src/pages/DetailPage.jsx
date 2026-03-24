import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getItemById } from "../services/api";

function DetailPage() {
	const { id } = useParams();
	const [item, setItem] = useState(null);

	useEffect(() => {
		getItemById(id)
			.then((data) => setItem(data))
			.catch((err) => console.error(err));
	}, [id]);

	if (!item) return <p>Chargement...</p>;

	return (
		<div>
			<h1>Detail</h1>

			<p>ID: {item.id}</p>
			<p>Nom: {item.nom ?? item.name}</p>
			<p>Modele: {item.modele}</p>
			<p>Description: {item.description}</p>
			<p>
				<Link to="/equipments">Retour a la liste</Link>
			</p>
		</div>
	);
}

export default DetailPage;
