import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createLaboratory,
  deleteLaboratory,
  getLaboratories,
  getLaboratoryById,
  updateLaboratory,
} from "../../services/laboratoryService";

const fields = [
  { name: "nom", label: "Nom", required: true },
  { name: "salle", label: "Salle" },
  { name: "information", label: "Information", type: "textarea" },
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
  { key: "salle", label: "Salle" },
  { key: "information", label: "Information" },
];

const service = {
  list: getLaboratories,
  getById: getLaboratoryById,
  create: createLaboratory,
  update: updateLaboratory,
  remove: deleteLaboratory,
};

export default function LaboratoryPage() {
  return (
    <EntityCrudPage
      title="Laboratoires"
      entityLabel="Laboratoire"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="laboratoire(s)"
    />
  );
}
