import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Page Login</h1>
			<p>Connexion simulée.</p>

			<div style={{ display: "flex", gap: "12px" }}>
				<button type="button" onClick={() => navigate("/equipments")}>Se connecter</button>
				<Link to="/equipments/add">Aller a la page ajout</Link>
			</div>
		</div>
	);
}

export default LoginPage;
