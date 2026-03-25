import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../../services/subjectService";

const fields = [
  { name: "nom", label: "Nom", required: true },
  { name: "code", label: "Code", required: true },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "statut",
    label: "Statut",
    type: "select",
    options: [
      { value: "requis", label: "Requis" },
      { value: "optionnel", label: "Optionnel" },
    ],
  },
  { name: "DepartmentId", label: "ID Département", type: "number", required: true },
  { name: "LaboratoryId", label: "ID Laboratoire", type: "number", required: true },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "nom", label: "Nom" },
  { key: "code", label: "Code" },
  { key: "statut", label: "Statut" },
];

const service = {
  list: getSubjects,
  getById: getSubjectById,
  create: createSubject,
  update: updateSubject,
  remove: deleteSubject,
};

export default function SubjectPage() {
  return (
    <EntityCrudPage
      title="Matières"
      entityLabel="Matière"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="matière(s)"
    />
  );
}
