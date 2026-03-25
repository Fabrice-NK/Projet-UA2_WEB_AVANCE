import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteEquipment,
  getEquipmentList,
} from "../../services/equipmentService";

export default function EquipmentListPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEquipment = async () => {
    try {
      const data = await getEquipmentList();
      setEquipment(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Erreur chargement équipements :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet équipement ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEquipment(id);
      loadEquipment();
    } catch (error) {
      console.error("Erreur suppression équipement :", error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Liste des équipements</h2>
        <Link to="/equipment/add" className="btn">
          Ajouter un équipement
        </Link>
      </div>

      <div className="grid">
        {equipment.map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.nom}</h3>
            <p><strong>Modèle :</strong> {item.modele}</p>
            <p>{item.description || "Aucune description"}</p>

            <div className="actions">
              <Link to={`/equipment/${item.id}`}>Détail</Link>
              <Link to={`/equipment/${item.id}/edit`}>Modifier</Link>
              <button onClick={() => handleDelete(item.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}