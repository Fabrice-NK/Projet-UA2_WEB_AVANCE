import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../../services/roleService";

const fields = [
  { name: "titre", label: "Titre", required: true },
  { name: "description", label: "Description", type: "textarea" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "titre", label: "Titre" },
  { key: "description", label: "Description" },
];

const service = {
  list: getRoles,
  getById: getRoleById,
  create: createRole,
  update: updateRole,
  remove: deleteRole,
};

export default function RolePage() {
  return (
    <EntityCrudPage
      title="Rôles"
      entityLabel="Rôle"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="rôle(s)"
    />
  );
}
