import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../../utils/notify"
import { useAuth } from "../../context/AuthContext"

const PREF_THEME_KEY = "pref_theme"
const PREF_NOTIFICATIONS_KEY = "pref_notifications"
const THEME_EVENT = "pref-theme-changed"

export default function AdminProfile() {
  const { checkAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [editing, setEditing] = useState(false)

  const [profile, setProfile] = useState({ name: "", email: "", telefone: "" })
  const [passwordForm, setPasswordForm] = useState({ current_password: "", password: "", password_confirmation: "" })

  const [theme, setTheme] = useState("claro")
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    const storedTheme = localStorage.getItem(PREF_THEME_KEY)
    if (storedTheme === "escuro" || storedTheme === "claro") setTheme(storedTheme)

    const storedNotif = localStorage.getItem(PREF_NOTIFICATIONS_KEY)
    if (storedNotif === "0" || storedNotif === "1") setNotifications(storedNotif === "1")
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)

    api
      .get("/user")
      .then((res) => {
        if (!active) return
        setProfile({
          name: res.data?.name ?? "",
          email: res.data?.email ?? "",
          telefone: res.data?.telefone ?? "",
        })
      })
      .catch(() => {
        if (!active) return
        mostrarErroMensagem("Não foi possível carregar o perfil.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const themeBtnClass = useMemo(() => (t) => `admin-btn ${theme === t ? "primary" : "secondary"}`, [theme])

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        telefone: profile.telefone || null,
      }

      await api.put("/user", payload)
      mostrarSucessoMensagem("Perfil atualizado.")
      setEditing(false)
      await checkAuth()
    } catch (e) {
      mostrarErroMensagem(e?.response?.data?.message || "Não foi possível atualizar o perfil.")
    } finally {
      setSavingProfile(false)
    }
  }

  const onProfilePrimaryClick = () => {
    if (loading) return
    if (!editing) {
      setEditing(true)
      return
    }
    if (savingProfile) return
    saveProfile()
  }

  const savePassword = async () => {
    setSavingPassword(true)
    try {
      await api.put("/user/password", passwordForm)
      mostrarSucessoMensagem("Senha alterada com sucesso.")
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" })
    } catch (e) {
      mostrarErroMensagem(e?.response?.data?.message || "Não foi possível alterar a senha.")
    } finally {
      setSavingPassword(false)
    }
  }

  const setThemePref = (t) => {
    setTheme(t)
    localStorage.setItem(PREF_THEME_KEY, t)
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  const toggleNotifications = () => {
    const next = !notifications
    setNotifications(next)
    localStorage.setItem(PREF_NOTIFICATIONS_KEY, next ? "1" : "0")
    mostrarSucessoMensagem("Preferências atualizadas.")
  }

  return (
    <AdminLayout title="Perfil/Configurações" subtitle="Dados e preferências">
      <div className="admin-grid cols-2">
        <div className="admin-card">
          <div className="admin-section-header">
            <h3>Perfil</h3>
            <button className="admin-btn primary" onClick={onProfilePrimaryClick} disabled={loading || savingProfile} type="button">
              {editing ? (savingProfile ? "A guardar..." : "Guardar") : "Editar"}
            </button>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>
              Nome
              <input
                className="admin-input"
                value={profile.name}
                disabled={!editing || loading}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>
              Email
              <input
                className="admin-input"
                value={profile.email}
                disabled={!editing || loading}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>
              Telefone
              <input
                className="admin-input"
                value={profile.telefone}
                disabled={!editing || loading}
                onChange={(e) => setProfile((p) => ({ ...p, telefone: e.target.value }))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-section-header">
            <h3>Preferências</h3>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Tema</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className={themeBtnClass("claro")} onClick={() => setThemePref("claro")} type="button">Claro</button>
                <button className={themeBtnClass("escuro")} onClick={() => setThemePref("escuro")} type="button">Escuro</button>
              </div>
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Notificações</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  className="pill"
                  onClick={toggleNotifications}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  {notifications ? "On" : "Off"}
                </button>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Push e email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Alterar Senha</h3>
          <button className="admin-btn primary" onClick={savePassword} disabled={loading || savingPassword} type="button">
            {savingPassword ? "A guardar..." : "Guardar"}
          </button>
        </div>
        <div style={{ display: "grid", gap: "10px", maxWidth: "420px" }}>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>
            Senha atual
            <input
              className="admin-input"
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current_password: e.target.value }))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </label>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>
            Nova senha
            <input
              className="admin-input"
              type="password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm((p) => ({ ...p, password: e.target.value }))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </label>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>
            Confirmar nova senha
            <input
              className="admin-input"
              type="password"
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm((p) => ({ ...p, password_confirmation: e.target.value }))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </label>
        </div>
      </div>
    </AdminLayout>
  )
}
