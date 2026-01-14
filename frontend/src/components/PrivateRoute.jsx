import React from "react";
import { useLocation, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// Componente de rota privada que verifica se o usuário está autenticado
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px" }}>A carregar...</p>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}