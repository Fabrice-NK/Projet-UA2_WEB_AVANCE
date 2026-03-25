import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEquipmentById,
  updateEquipment,
} from "../../services/equipmentService";

export default function EquipmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await getEquipmentById(id);
        const item = data?.data || data;

        reset({
          nom: item.nom || "",
          modele: item.modele || "",
          description: item.description || "",
        });
      } catch (error) {
        console.error("Erreur chargement équipement :", error);
      }
    };

    loadEquipment();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("modele", data.modele);
      formData.append("description", data.description || "");

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await updateEquipment(id, formData);
      navigate(`/equipment/${id}`);
    } catch (error) {
      console.error("Erreur modification équipement :", error);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Modifier un équipement</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div>
            <label>Nom</label>
            <input
              {...register("nom", { required: "Le nom est obligatoire" })}
            />
            {errors.nom && <p className="error">{errors.nom.message}</p>}
          </div>

          <div>
            <label>Modèle</label>
            <select
              {...register("modele", { required: "Le modèle est obligatoire" })}
            >
              <option value="">Choisir</option>
              <option value="nouveau">nouveau</option>
              <option value="ancien">ancien</option>
              <option value="refait">refait</option>
            </select>
            {errors.modele && <p className="error">{errors.modele.message}</p>}
          </div>

          <div>
            <label>Description</label>
            <textarea {...register("description")} rows="4" />
          </div>

          <div>
            <label>Nouvelle image</label>
            <input type="file" {...register("image")} />
          </div>

          <button type="submit">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}