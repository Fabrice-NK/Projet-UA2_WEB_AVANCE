import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEquipmentById } from "../../services/equipmentService";

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await getEquipmentById(id);
        setEquipment(data?.data || data);
      } catch (error) {
        console.error("Erreur détail équipement :", error);
      }
    };

    loadEquipment();
  }, [id]);

  if (!equipment) return <p>Chargement...</p>;

  return (
    <div className="page">
      <div className="card">
        <h2>{equipment.nom}</h2>
        <p><strong>Modèle :</strong> {equipment.modele}</p>
        <p><strong>Description :</strong> {equipment.description || "—"}</p>

        <div className="actions">
          <Link to={`/equipment/${id}/edit`}>Modifier</Link>
          <Link to="/equipment">Retour</Link>
        </div>
      </div>
    </div>
  );
}