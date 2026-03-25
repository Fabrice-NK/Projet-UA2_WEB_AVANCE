import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import LaboratoryListPage from "../pages/laboratory/LaboratoryListPage";
import LaboratoryAddPage from "../pages/laboratory/LaboratoryAddPage";
// import LaboratoryEditPage from "../pages/laboratory/LaboratoryEditPage";
// import LaboratoryDetailPage from "../pages/laboratory/LaboratoryDetailPage";
// import EquipmentListPage from "../pages/equipment/EquipmentListPage";
// import EquipmentAddPage from "../pages/equipment/EquipmentAddPage";
// import EquipmentEditPage from "../pages/equipment/EquipmentEditPage";
// import EquipmentDetailPage from "../pages/equipment/EquipmentDetailPage";
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

        <Route path="laboratories" element={<LaboratoryListPage />} />
        <Route path="laboratories/add" element={<LaboratoryAddPage />} />
        {/* <Route path="laboratories/:id" element={<LaboratoryDetailPage />} />
        <Route path="laboratories/:id/edit" element={<LaboratoryEditPage />} /> */}

        {/* <Route path="equipment" element={<EquipmentListPage />} />
        <Route path="equipment/add" element={<EquipmentAddPage />} />
        <Route path="equipment/:id" element={<EquipmentDetailPage />} />
        <Route path="equipment/:id/edit" element={<EquipmentEditPage />} /> */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}