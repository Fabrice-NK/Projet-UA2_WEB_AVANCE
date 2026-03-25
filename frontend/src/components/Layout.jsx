import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";


// Ce composant définit la structure de base de l'application, avec une barre de navigation en haut,
//  une barre latérale pour les liens de navigation, et une zone principale pour afficher le contenu des différentes pages. 
// Il inclut également un bouton de déconnexion qui utilise Redux pour gérer l'état d'authentification.

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Gestion Laboratoires & Équipements</h1>
        <button onClick={handleLogout}>Déconnexion</button>
      </header>

      <nav className="sidebar">
        <NavLink to="/laboratories">Laboratoires</NavLink>
        <NavLink to="/equipment">Équipements</NavLink>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}