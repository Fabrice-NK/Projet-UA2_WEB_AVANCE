import React from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import AddPage from "./pages/AddPage";
import DetailPage from "./pages/DetailPage";
import EditPage from "./pages/EditPage";
import ListPage from "./pages/ListPage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <BrowserRouter>
            <div style={{ padding: "16px" }}>
                <h1>Gestion Laboratoire</h1>

                <nav style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/equipments">Liste</NavLink>
                    <NavLink to="/equipments/add">Ajouter</NavLink>
                </nav>

                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/equipments" element={<ListPage />} />
                    <Route path="/equipments/add" element={<AddPage />} />
                    <Route path="/edit/:id" element={<EditPage />} />
                    <Route path="/equipments/:id" element={<DetailPage />} />
                    <Route path="*" element={<h2>Page non trouvee</h2>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;