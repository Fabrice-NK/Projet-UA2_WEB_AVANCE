import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createEquipment } from "../../services/equipmentService";

export default function EquipmentAddPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("modele", data.modele);
      formData.append("description", data.description || "");

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await createEquipment(formData);
      navigate("/equipment");
    } catch (error) {
      console.error("Erreur création équipement :", error);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Ajouter un équipement</h2>

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
            <label>Image</label>
            <input type="file" {...register("image")} />
          </div>

          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}