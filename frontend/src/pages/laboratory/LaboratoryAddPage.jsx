import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { createLaboratory } from "../../services/laboratoryService";

const schema = yup.object({
  nom: yup.string().required("Le nom est obligatoire").min(2, "Au moins 2 caractères"),
  salle: yup.string().optional(),
  information: yup.string().optional(),
});

export default function LaboratoryAddPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("salle", data.salle || "");
      formData.append("information", data.information || "");

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await createLaboratory(formData);
      navigate("/laboratories");
    } catch (error) {
      console.error("Erreur création laboratoire :", error);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Ajouter un laboratoire</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div>
            <label>Nom</label>
            <input
              {...register("nom", { required: "Le nom est obligatoire" })}
            />
            {errors.nom && <p className="error">{errors.nom.message}</p>}
          </div>

          <div>
            <label>Salle</label>
            <input {...register("salle")} />
          </div>

          <div>
            <label>Information</label>
            <textarea {...register("information")} rows="4" />
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