import AdminLayout from "../../components/AdminLayout"

export default function AdminProfile() {
  return (
    <AdminLayout title="Perfil/Configurações" subtitle="Dados e preferências">
      <div className="admin-grid cols-2">
        <div className="admin-card">
          <div className="admin-section-header">
            <h3>Perfil</h3>
            <button className="admin-btn primary">Editar</button>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>Nome
              <input className="admin-input" defaultValue="Ana Silva" style={{ width: "100%", marginTop: "4px" }} />
            </label>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>Email
              <input className="admin-input" defaultValue="ana@gmail.com" style={{ width: "100%", marginTop: "4px" }} />
            </label>
            <label style={{ fontSize: "13px", color: "#6b7280" }}>Telefone
              <input className="admin-input" defaultValue="912 000 000" style={{ width: "100%", marginTop: "4px" }} />
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
                <button className="admin-btn secondary">Claro</button>
                <button className="admin-btn secondary">Escuro</button>
              </div>
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Notificações</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span className="pill">On</span>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Push e email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Alterar Senha</h3>
          <button className="admin-btn primary">Guardar</button>
        </div>
        <div style={{ display: "grid", gap: "10px", maxWidth: "420px" }}>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>Senha atual
            <input className="admin-input" type="password" style={{ width: "100%", marginTop: "4px" }} />
          </label>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>Nova senha
            <input className="admin-input" type="password" style={{ width: "100%", marginTop: "4px" }} />
          </label>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>Confirmar nova senha
            <input className="admin-input" type="password" style={{ width: "100%", marginTop: "4px" }} />
          </label>
        </div>
      </div>
    </AdminLayout>
  )
}
