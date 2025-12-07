import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
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

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "60px"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                width: "450px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                textAlign: "center"
            }}>
                <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
                    Home Page
                </h1>

                {/* NÃO AUTENTICADO */}
                {!user && (
                    <div>
                        <p style={{ fontSize: "18px" }}>
                            Bem-vindo!
                        </p>
                        <p>
                            <Link
                                to="/login"
                                style={{
                                    color: "#2563eb",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                }}
                            >
                                Iniciar Sessão
                            </Link>
                        </p>
                        <p>
                            <Link
                                to="/registar"
                                style={{
                                    color: "#16a34a",
                                    fontWeight: "bold",
                                    textDecoration: "none"
                                }}
                            >
                                Criar Conta
                            </Link>
                        </p>
                    </div>
                )}

                {/* CLIENTE */}
                {user && user.cargo === 'cliente' && (
                    <div>
                        <h3 style={{ marginBottom: "10px" }}>
                            Olá, {user.name}!
                        </h3>

                        <Link
                            to="/perfil"
                            style={{
                                display: "inline-block",
                                marginTop: "10px",
                                padding: "10px 20px",
                                background: "#2563eb",
                                color: "white",
                                borderRadius: "8px",
                                textDecoration: "none"
                            }}
                        >
                            Ver Perfil
                        </Link>
                    </div>
                )}

                {/* ADMINISTRADOR */}
                {user && user.cargo === 'administrador' && (
                    <div>
                        <h3 style={{ marginBottom: "10px" }}>
                            Olá, {user.name}!
                        </h3>

                        <Link
                            to="/quartos"
                            style={{
                                display: "inline-block",
                                marginTop: "10px",
                                padding: "10px 20px",
                                background: "#dc2626",
                                color: "white",
                                borderRadius: "8px",
                                textDecoration: "none"
                            }}
                        >
                            Gestão de quartos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}