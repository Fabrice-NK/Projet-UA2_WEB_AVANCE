import React from "react";
import EntityCrudPage from "../../components/EntityCrudPage";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../services/userService";

const fields = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "mot_de_passe", label: "Mot de passe", type: "password", required: true },
  { name: "naissance", label: "Date de naissance", type: "date" },
  { name: "biographie", label: "Biographie", type: "textarea" },
  {
    name: "conduite",
    label: "Conduite",
    type: "select",
    options: [
      { value: "Excellente", label: "Excellente" },
      { value: "Bonne", label: "Bonne" },
      { value: "Passable", label: "Passable" },
    ],
  },
  { name: "DepartmentId", label: "ID Département", type: "number", required: true },
  { name: "photo", label: "Photo", type: "file", accept: "image/*" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "email", label: "Email" },
];

const service = {
  list: getUsers,
  getById: getUserById,
  create: createUser,
  update: updateUser,
  remove: deleteUser,
};

export default function UserPage() {
  return (
    <EntityCrudPage
      title="Utilisateurs"
      entityLabel="Utilisateur"
      fields={fields}
      columns={columns}
      service={service}
      countLabel="utilisateur(s)"
    />
  );
}
