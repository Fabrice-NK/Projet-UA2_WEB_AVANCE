import { Link, useNavigate } from "react-router-dom";

function AddPage() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Page Ajout</h1>
			<p>Formulaire d'ajout (exemple).</p>

			<div style={{ display: "flex", gap: "12px" }}>
				<button type="button" onClick={() => navigate("/equipments")}>Retour liste</button>
				<Link to="/login">Aller au login</Link>
			</div>
		</div>
	);
}

export default AddPage;
