import React, { use } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

// Componente de rota privada que verifica se o usuário está autenticado
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

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

    return user ? children : <Navigate to="/" replace />;
}