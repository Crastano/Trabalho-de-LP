import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../utils/notify';
import { ClipLoader } from 'react-spinners';

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
            const response = await api.post('/registar', { name, email, password });

            if (response.status === 201) {
                mostrarSucessoMensagem(response.data.message);
                navigate('/login');
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
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            height: "100vh", background: "#f3f4f6"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                width: "350px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Criar Conta</h2>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label>Nome:</label>
                        <input
                            type="text"
                            placeholder="Seu Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "100%", padding: "8px",
                                borderRadius: "8px", border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%", padding: "8px",
                                borderRadius: "8px", border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%", padding: "8px",
                                borderRadius: "8px", border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <div>
                        <label>Confirmar Password:</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            style={{
                                width: "100%", padding: "8px",
                                borderRadius: "8px", border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: "#16a34a", color: "white",
                            padding: "10px", borderRadius: "8px", cursor: "pointer",
                            border: "none"
                        }}
                    >
                        {!loading ? "Criar Conta" : <ClipLoader size={18} color="#fff" />}
                    </button>
                </form>

                <p style={{ marginTop: "15px", textAlign: "center" }}>
                    Já tens conta?
                    <Link to="/login" style={{ marginLeft: 5, color: "#2563eb" }}>Iniciar sessão</Link>
                </p>

                <p style={{ marginTop: "15px", textAlign: "center" }}>
                    Voltar ao Início
                    <Link to="/" style={{ marginLeft: 5, color: "#2563eb" }}>Home Page</Link>
                </p>
            </div>
        </div>
    );
}
