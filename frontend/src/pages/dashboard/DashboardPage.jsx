import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h2>Tableau de bord</h2>
          <p className="subtitle">Vue générale de l'application</p>
        </div>
      </div>

      <div className="grid dashboard-grid">
        <Link to="/users" className="card stat-card dashboard-card">
          <h3>Utilisateurs</h3>
          <p>Gérer les comptes et les accès.</p>
        </Link>
        <Link to="/departments" className="card stat-card dashboard-card">
          <h3>Départements</h3>
          <p>Organiser les entités académiques.</p>
        </Link>
        <Link to="/laboratories" className="card stat-card dashboard-card">
          <h3>Laboratoires</h3>
          <p>Suivre les espaces et ressources.</p>
        </Link>
        <Link to="/equipment" className="card stat-card dashboard-card">
          <h3>Équipements</h3>
          <p>Consulter et maintenir le matériel.</p>
        </Link>
      </div>
    </div>
  );
}
