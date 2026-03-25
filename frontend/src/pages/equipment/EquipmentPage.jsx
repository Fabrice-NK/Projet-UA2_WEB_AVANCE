import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createEquipment,
  deleteEquipment,
  getEquipmentById,
  getEquipmentList,
  updateEquipment,
} from "../../services/equipmentService";

const fields = [
  { name: "nom", label: "Nom", required: true },
  {
    name: "modele",
    label: "Modèle",
    type: "select",
    required: true,
    options: [
      { value: "nouveau", label: "Nouveau" },
      { value: "ancien", label: "Ancien" },
      { value: "refait", label: "Refait" },
    ],
  },
  { name: "description", label: "Description", type: "textarea" },
  { name: "LaboratoryId", label: "ID Laboratoire", type: "number", required: true },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
];

const columns = [
  {
    key: "image",
    label: "Image",
    render: (item) =>
      item.image ? (
        <img src={item.image} alt={item.nom} className="thumb" />
      ) : (
        "-"
      ),
  },
  { key: "nom", label: "Nom" },
  { key: "modele", label: "Modèle" },
  { key: "LaboratoryId", label: "Laboratoire" },
  { key: "description", label: "Description" },
];

const service = {
  list: getEquipmentList,
  getById: getEquipmentById,
  create: createEquipment,
  update: updateEquipment,
  remove: deleteEquipment,
};

export default function EquipmentPage() {
  return (
    <EntityCrudPage
      title="Équipements"
      entityLabel="Équipement"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="équipement(s)"
    />
  );
}
