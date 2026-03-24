import React from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddPage from "./pages/AddPage";
import DetailPage from "./pages/DetailPage";
import EditPage from "./pages/EditPage";
import ListPage from "./pages/ListPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { logout } from "./store/authSlice";

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    return (
        <BrowserRouter>
            <div style={{ padding: "16px" }}>
                <h1>Gestion Laboratoire</h1>

                <nav style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/equipments">Liste</NavLink>
                    <NavLink to="/equipments/add">Ajouter</NavLink>
                    {user && (
                        <button type="button" onClick={() => dispatch(logout())}>
                            Logout
                        </button>
                    )}
                </nav>

                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/equipments" replace /> : <LoginPage />}
                    />
                    <Route
                        path="/equipments"
                        element={<ProtectedRoute><ListPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/equipments/add"
                        element={<ProtectedRoute><AddPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/edit/:id"
                        element={<ProtectedRoute><EditPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/equipments/:id"
                        element={<ProtectedRoute><DetailPage /></ProtectedRoute>}
                    />
                    <Route path="*" element={<h2>Page non trouvee</h2>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;