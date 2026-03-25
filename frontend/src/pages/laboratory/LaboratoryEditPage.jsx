// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getLaboratoryById,
//   updateLaboratory,
// } from "../../services/laboratoryService";

// export default function LaboratoryEditPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   useEffect(() => {
//     const loadLaboratory = async () => {
//       try {
//         const data = await getLaboratoryById(id);
//         const lab = data?.data || data;

//         reset({
//           nom: lab.nom || "",
//           salle: lab.salle || "",
//           information: lab.information || "",
//         });
//       } catch (error) {
//         console.error("Erreur chargement labo :", error);
//       }
//     };

//     loadLaboratory();
//   }, [id, reset]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append("nom", data.nom);
//       formData.append("salle", data.salle || "");
//       formData.append("information", data.information || "");

//       if (data.image?.[0]) {
//         formData.append("image", data.image[0]);
//       }

//       await updateLaboratory(id, formData);
//       navigate(`/laboratories/${id}`);
//     } catch (error) {
//       console.error("Erreur modification laboratoire :", error);
//     }
//   };

//   return (
//     <div className="page">
//       <div className="card">
//         <h2>Modifier un laboratoire</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="form">
//           <div>
//             <label>Nom</label>
//             <input
//               {...register("nom", { required: "Le nom est obligatoire" })}
//             />
//             {errors.nom && <p className="error">{errors.nom.message}</p>}
//           </div>

//           <div>
//             <label>Salle</label>
//             <input {...register("salle")} />
//           </div>

//           <div>
//             <label>Information</label>
//             <textarea {...register("information")} rows="4" />
//           </div>

//           <div>
//             <label>Nouvelle image</label>
//             <input type="file" {...register("image")} />
//           </div>

//           <button type="submit">Mettre à jour</button>
//         </form>
//       </div>
//     </div>
//   );
// }