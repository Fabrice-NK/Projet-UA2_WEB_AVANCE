import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

function LoginPage() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");

	const handleLogin = () => {
		const fakeUser = { email };
		dispatch(login(fakeUser));
	};

	return (
		<div>
			<h1>Login</h1>

			<input
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<button type="button" onClick={handleLogin}>
				Se connecter
			</button>
		</div>
	);
}

export default LoginPage;
