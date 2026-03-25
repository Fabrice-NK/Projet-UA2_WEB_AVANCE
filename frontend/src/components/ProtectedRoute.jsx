import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


// Ce composant est utilisé pour protéger les routes de l'application en vérifiant si l'utilisateur est authentifié. Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion. Sinon, les enfants du composant sont rendus normalement.

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}