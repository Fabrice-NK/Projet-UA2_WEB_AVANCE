import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLaboratory,
  getLaboratories,
} from "../../services/laboratoryService";

export default function LaboratoryListPage() {
  const navigate = useNavigate();
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLaboratories = async () => {
    try {
      setErrorMessage("");
      const res = await getLaboratories();
      // backend renvoie { data: { laboratories: [...], total, ... } }
      const raw = res?.data?.laboratories ?? res?.data ?? res;
      setLaboratories(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error("Erreur chargement laboratories :", error);
      setErrorMessage("Impossible de charger les laboratoires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaboratories();
  }, []);

  const filteredLaboratories = useMemo(() => {
    const safeList = Array.isArray(laboratories) ? laboratories : [];
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return safeList;

    return safeList.filter((lab) => {
      return [lab.nom, lab.salle, lab.information]
        .map((value) => String(value ?? "").toLowerCase())
        .some((value) => value.includes(needle));
    });
  }, [laboratories, searchTerm]);

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
        <div>
          <h2>Laboratoires</h2>
          <p className="subtitle">{filteredLaboratories.length} laboratoire(s)</p>
        </div>
        <Link to="/laboratories/add" className="btn">
          Ajouter un laboratoire
        </Link>
      </div>

      <div className="card">
        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="toolbar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredLaboratories.length === 0 ? (
          <p>Aucun laboratoire trouvé</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Salle</th>
                  <th>Information</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaboratories.map((lab) => (
                  <tr key={lab.id}>
                    <td>
                      {lab.image ? (
                        <img src={lab.image} alt={lab.nom} className="thumb" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{lab.nom || "-"}</td>
                    <td>{lab.salle || "-"}</td>
                    <td>{lab.information || "-"}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/laboratories/${lab.id}`}>Détail</Link>
                        <Link to={`/laboratories/${lab.id}/edit`}>Modifier</Link>
                        <button onClick={() => handleDelete(lab.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}