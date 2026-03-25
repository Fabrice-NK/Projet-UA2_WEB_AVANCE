// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   getLaboratoryById,
//   getLaboratoryEquipment,
// } from "../../services/laboratoryService";

// export default function LaboratoryDetailPage() {
//   const { id } = useParams();
//   const [laboratory, setLaboratory] = useState(null);
//   const [equipment, setEquipment] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const labData = await getLaboratoryById(id);
//         const equipmentData = await getLaboratoryEquipment(id);

//         setLaboratory(labData?.data || labData);
//         setEquipment(
//           Array.isArray(equipmentData) ? equipmentData : equipmentData?.data || []
//         );
//       } catch (error) {
//         console.error("Erreur détail laboratoire :", error);
//       }
//     };

//     loadData();
//   }, [id]);

//   if (!laboratory) return <p>Chargement...</p>;

//   return (
//     <div className="page">
//       <div className="card">
//         <h2>{laboratory.nom}</h2>
//         <p><strong>Salle :</strong> {laboratory.salle || "—"}</p>
//         <p><strong>Information :</strong> {laboratory.information || "—"}</p>

//         <div className="actions">
//           <Link to={`/laboratories/${id}/edit`}>Modifier</Link>
//           <Link to="/laboratories">Retour</Link>
//         </div>
//       </div>

//       <div className="card">
//         <h3>Équipements liés au laboratoire</h3>
//         {equipment.length === 0 ? (
//           <p>Aucun équipement associé.</p>
//         ) : (
//           <ul>
//             {equipment.map((item) => (
//               <li key={item.id}>
//                 {item.nom} - {item.modele}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }