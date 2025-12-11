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
        <div className="login-page">
            <style>{`
                .login-page{display:flex;min-height:100vh;font-family:Arial,Helvetica,sans-serif}
                .left{flex:1;display:flex;align-items:center;justify-content:center;background:#f3f4f6;padding:60px}
                .form-card{width:420px;background:white;border-radius:8px;padding:32px;box-shadow:0 6px 20px rgba(0,0,0,0.15)}
                .form-card h2{margin:0 0 18px 0;text-align:left;font-size:22px}
                .form-row{margin-bottom:12px}
                .form-row label{display:block;font-size:13px;color:#374151;margin-bottom:6px}
                .form-row input{width:100%;padding:10px;border-radius:8px;border:1px solid #e5e7eb}
                .login-btn{width:100%;background:#2563eb;color:white;padding:10px;border-radius:8px;border:none;cursor:pointer;margin-top:6px}
                .small-link{font-size:13px;color:#2563eb;text-decoration:none}

                .right{flex:1;background-image:url('/src/assets/images/white-umbrellas.jpg');background-size:cover;background-position:center;position:relative;display:flex;align-items:center;justify-content:center}
                .right::before{content:"";position:absolute;inset:0;background:rgba(27, 44, 86, 0.6)}
                .right-content{position:relative;color:white;text-align:center;padding:20px;max-width:420px}
                .right-content h3{font-size:26px;margin-bottom:18px}
                .cta-btn{background:#f59e0b;color:#111;padding:12px 100px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:12px}

                @media (max-width:900px){
                    .login-page{flex-direction:column}
                    .right{height:280px}
                }
                @media (max-width:640px){
                    .right{display:none}
                    .left{padding:24px}
                    .form-card{width:100%}
                }
            `}</style>

            <div className="left">
                <div className="form-card">
                    <h2>Iniciar Sessão</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            {!loading ? 'Login' : <ClipLoader size={18} color="#fff" />}
                        </button>
                    </form>

                    <div style={{display:'flex',justifyContent:'space-between',marginTop:14}}>
                        <Link to="/forgot" className="small-link">Forgot password ?</Link>
                        <Link to="/registar" className="small-link">Criar Conta</Link>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="right-content">
                    <h3>Register first if you don't have an account yet.</h3>
                    <Link to="/registar" className="cta-btn">Register</Link>
                </div>
            </div>
        </div>
    );
}
