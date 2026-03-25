import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isAuthenticated && token && token !== "undefined" && token !== "null") {
      navigate("/laboratories");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="page login-page">
      <div className="card">
        <h2>Connexion</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div>
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}