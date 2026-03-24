import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { validateLoginForm } from "../helpers/validation";

function LoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setErrors({});

		// Validate form
		const validationErrors = validateLoginForm(email, password);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			setLoading(true);
			// Placeholder: Replace with real API call
			const fakeUser = { email };
			dispatch(login(fakeUser));
			localStorage.setItem("token", "fake-token-" + Date.now());
			navigate("/equipments");
		} catch (err) {
			setErrors({ submit: "Login failed. Please try again." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card p-4">
						<h1 className="mb-4 text-center">Connexion</h1>

						{errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

						<form onSubmit={handleLogin}>
							<div className="mb-3">
								<label className="form-label">Email *</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={`form-control ${errors.email ? "is-invalid" : ""}`}
									placeholder="Entrez votre email"
								/>
								{errors.email && <div className="invalid-feedback">{errors.email}</div>}
							</div>

							<div className="mb-3">
								<label className="form-label">Mot de passe *</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className={`form-control ${errors.password ? "is-invalid" : ""}`}
									placeholder="Entrez votre mot de passe"
								/>
								{errors.password && <div className="invalid-feedback">{errors.password}</div>}
							</div>

							<button type="submit" disabled={loading} className="btn btn-primary w-100">
								{loading ? "Connexion..." : "Se connecter"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
