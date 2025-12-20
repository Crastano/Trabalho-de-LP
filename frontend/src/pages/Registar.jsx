import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/api";
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../utils/notify";
import { ClipLoader } from "react-spinners";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Registar() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmarPassword) {
            mostrarErroMensagem("As passwords não coincidem!");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/registar", { name, email, password });

            if (response.status === 201) {
                mostrarSucessoMensagem(response.data.message);
                navigate("/login");
            } else {
                mostrarErroMensagem("Erro ao registar.");
            }
        } catch (error) {
            mostrarErroMensagem(error.response?.data?.message || "Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main
                style={{
                    minHeight: "calc(100vh - 240px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f6f6f8",
                    padding: "60px 20px",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        width: "380px",
                        padding: "28px 26px",
                        borderRadius: "14px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        border: "1px solid #f1f1f1",
                    }}
                >
                    <h2 style={{ textAlign: "center", margin: "0 0 22px", fontSize: "18px", fontWeight: 700 }}>
                        Register
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                height: "38px",
                                padding: "0 10px",
                                borderRadius: "6px",
                                border: "1px solid #d9d9d9",
                                fontSize: "13px",
                            }}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                height: "38px",
                                padding: "0 10px",
                                borderRadius: "6px",
                                border: "1px solid #d9d9d9",
                                fontSize: "13px",
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                height: "38px",
                                padding: "0 10px",
                                borderRadius: "6px",
                                border: "1px solid #d9d9d9",
                                fontSize: "13px",
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            style={{
                                height: "38px",
                                padding: "0 10px",
                                borderRadius: "6px",
                                border: "1px solid #d9d9d9",
                                fontSize: "13px",
                            }}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "6px",
                                height: "38px",
                                background: "#f6b300",
                                color: "#111",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {!loading ? "Register" : <ClipLoader size={16} color="#111" />}
                        </button>
                    </form>

                    <div style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: "#2563eb" }}>
                        <Link to="/login" style={{ color: "#2563eb" }}>
                            Already Register ?
                        </Link>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0 14px" }}>
                        <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
                        <button
                            type="button"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                border: "1px solid #e5e5e5",
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            G
                        </button>
                        <button
                            type="button"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                border: "1px solid #e5e5e5",
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            A
                        </button>
                        <button
                            type="button"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                border: "1px solid #e5e5e5",
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            f
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
