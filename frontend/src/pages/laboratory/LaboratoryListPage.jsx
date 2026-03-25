import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteLaboratory,
  getLaboratories,
} from "../../services/laboratoryService";

export default function LaboratoryListPage() {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLaboratories = async () => {
    try {
      const data = await getLaboratories();
      setLaboratories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur chargement laboratories :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaboratories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce laboratoire ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteLaboratory(id);
      loadLaboratories();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Liste des laboratoires</h2>
        <Link to="/laboratories/add" className="btn">
          Ajouter un laboratoire
        </Link>
      </div>

      <div className="grid">
        {laboratories.map((lab) => (
          <div className="card" key={lab.id}>
            <h3>{lab.nom}</h3>
            <p><strong>Salle :</strong> {lab.salle || "—"}</p>
            <p>{lab.information || "Aucune information"}</p>

            <div className="actions">
              <Link to={`/laboratories/${lab.id}`}>Détail</Link>
              <Link to={`/laboratories/${lab.id}/edit`}>Modifier</Link>
              <button onClick={() => handleDelete(lab.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}