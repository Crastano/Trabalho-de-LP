import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../utils/notify';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const { updateAuthState } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });

            if (response.status === 200) {
                mostrarSucessoMensagem(response.data.message);
                updateAuthState(response.data.access_token, response.data.user);
                navigate('/');
            } else {
                mostrarErroMensagem("Erro ao iniciar sessão.");
            }
        } catch (error) {
            mostrarErroMensagem(
                error.response ? error.response.data.message : "Erro de rede."
            );
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
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Iniciar Sessão</h2>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%", padding: "8px", borderRadius: "8px",
                                border: "1px solid #ccc"
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
                                width: "100%", padding: "8px", borderRadius: "8px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: "#2563eb", color: "white",
                            padding: "10px", borderRadius: "8px", cursor: "pointer",
                            border: "none"
                        }}
                    >
                        {!loading ? "Login" : <ClipLoader size={18} color="#fff" />}
                    </button>
                </form>

                <p style={{ marginTop: "15px", textAlign: "center" }}>
                    Não tens conta?
                    <Link to="/registar" style={{ marginLeft: 5, color: "#2563eb" }}>Criar conta</Link>
                </p>

                <p style={{ marginTop: "15px", textAlign: "center" }}>
                    Voltar ao Início
                    <Link to="/" style={{ marginLeft: 5, color: "#2563eb" }}>Home Page</Link>
                </p>
            </div>
        </div>
    );
}
