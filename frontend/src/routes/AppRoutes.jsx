import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import LaboratoryPage from "../pages/laboratory/LaboratoryPage";
import EquipmentPage from "../pages/equipment/EquipmentPage";
import DepartmentPage from "../pages/departments/DepartmentPage";
import SubjectPage from "../pages/subjects/SubjectPage";
import RolePage from "../pages/roles/RolePage";
import UserPage from "../pages/users/UserPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";


// Ce fichier définit les routes de l'application en utilisant React Router. Il inclut une route pour la page de connexion, ainsi que des routes protégées pour les pages principales de l'application (laboratoires et équipements). Les routes protégées utilisent le composant ProtectedRoute pour vérifier si l'utilisateur est authentifié avant de permettre l'accès aux pages. Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion.

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/laboratories" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="laboratories" element={<LaboratoryPage />} />
        <Route path="laboratories/add" element={<Navigate to="/laboratories" replace />} />
        <Route path="laboratories/:id" element={<Navigate to="/laboratories" replace />} />
        <Route path="laboratories/:id/edit" element={<Navigate to="/laboratories" replace />} />

        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="departments" element={<DepartmentPage />} />
        <Route path="subjects" element={<SubjectPage />} />
        <Route path="roles" element={<RolePage />} />
        <Route path="users" element={<UserPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}