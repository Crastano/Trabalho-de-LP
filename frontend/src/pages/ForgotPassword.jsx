import React, { useState } from "react"
import { Link } from "react-router"
import api from "../api/api"
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../utils/notify"
import { ClipLoader } from "react-spinners"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const resp = await api.post("/forgot-password", { email })
      mostrarSucessoMensagem(resp?.data?.message || "Se o email existir, enviámos um link para redefinir a password.")
    } catch (error) {
      const message = error?.response?.data?.message || "Erro ao pedir reset de password."
      mostrarErroMensagem(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page" style={{ minHeight: "800px" }}>
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
        @media (max-width:640px){
          .left{padding:24px}
          .form-card{width:100%}
        }
      `}</style>

      <div className="left">
        <div className="form-card">
          <h2>Esqueci-me da password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {!loading ? "Enviar link" : <ClipLoader size={18} color="#fff" />}
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <Link to="/login" className="small-link">
              Voltar ao login
            </Link>
            <Link to="/registar" className="small-link">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
