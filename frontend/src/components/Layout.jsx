import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function NavIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
      {children}
    </svg>
  );
}


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
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo-gestilab.svg" alt="GestiLab" className="brand-logo" />
          <span>GestiLab</span>
        </div>

        <div className="sidebar-section-title">Gestion</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            <NavIcon>
              <path d="M4 13h7V4H4zM13 20h7v-7h-7zM13 4v7h7V4zM4 20h7v-5H4z" />
            </NavIcon>
            Tableau de bord
          </NavLink>
          <NavLink to="/users">
            <NavIcon>
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0z" />
            </NavIcon>
            Utilisateurs
          </NavLink>
          <NavLink to="/departments">
            <NavIcon>
              <path d="M4 4h16v16H4zM8 8h2v2H8zm0 4h2v2H8zm0 4h2v2H8zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z" />
            </NavIcon>
            Départements
          </NavLink>
          <NavLink to="/subjects">
            <NavIcon>
              <path d="M6 5h12v14H6zM8 8h8v2H8zm0 4h8v2H8z" />
            </NavIcon>
            Matières
          </NavLink>
          <NavLink to="/roles">
            <NavIcon>
              <path d="M12 2 3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7zM11 17l-4-4 1.4-1.4 2.6 2.6 4.6-4.6L17 11z" />
            </NavIcon>
            Rôles
          </NavLink>
        </nav>

        <div className="sidebar-section-title">Laboratoires</div>
        <nav className="sidebar-nav">
          <NavLink to="/laboratories">
            <NavIcon>
              <path d="M9 2h6v2l-1 5 5 9a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 18l5-9-1-5zM9 14h6" />
            </NavIcon>
            Laboratoires
          </NavLink>
          <NavLink to="/equipment">
            <NavIcon>
              <path d="M21 7 17 3l-2 2 4 4zM14 6l4 4-8.5 8.5H5v-4.5z" />
            </NavIcon>
            Équipements
          </NavLink>
        </nav>

        <div className="sidebar-user-card">
          <div>
            <strong>Fabrice Dia</strong>
            <p>Utilisateur</p>
          </div>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </aside>

      <main className="content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}