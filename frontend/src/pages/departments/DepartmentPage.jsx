import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../../services/departmentService";

const fields = [
  { name: "nom", label: "Nom", required: true },
  { name: "histoire", label: "Histoire", type: "textarea" },
  {
    name: "domaine",
    label: "Domaine",
    type: "select",
    required: true,
    options: [
      { value: "sciences", label: "Sciences" },
      { value: "literature", label: "Littérature" },
      { value: "autre", label: "Autre" },
    ],
  },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "nom", label: "Nom" },
  { key: "domaine", label: "Domaine" },
];

const service = {
  list: getDepartments,
  getById: getDepartmentById,
  create: createDepartment,
  update: updateDepartment,
  remove: deleteDepartment,
};

export default function DepartmentPage() {
  return (
    <EntityCrudPage
      title="Départements"
      entityLabel="Département"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="département(s)"
    />
  );
}
