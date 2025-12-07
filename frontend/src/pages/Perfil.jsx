import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
    const { user, clearAuthState } = useAuth();

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
                background: "white", padding: "30px",
                width: "500px", borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>
                <h2 style={{ fontSize: "28px", marginBottom: "20px", textAlign: "center" }}>
                    Perfil de Utilizador
                </h2>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link
                        to="/"
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            padding: "10px 20px",
                            background: "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}>Home</Link>
                    <button
                        onClick={clearAuthState}
                        style={{
                            display: "inline-block",
                            background: "#dc2626", 
                            color: "white",
                            marginTop: "10px",
                            padding: "10px 20px", 
                            borderRadius: "8px",
                            border: "none", 
                            cursor: "pointer",
                            textDecoration: "none"
                        }}
                    >
                        Logout
                    </button>
                </div>

                <div style={{ marginTop: "25px" }}>
                    <p><strong>Nome:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Conta criada:</strong> {moment(user?.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                </div>
            </div>
        </div>
    );
}
