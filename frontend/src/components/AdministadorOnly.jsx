import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

// Componente de rota que verifica se o usuário é administrador
export default function AdministradorOnly({ children }) {
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

    if (!user) return <Navigate to="/login" replace />;

    if (user.cargo !== 'administrador') return <Navigate to="/" replace />;

    return children;
}