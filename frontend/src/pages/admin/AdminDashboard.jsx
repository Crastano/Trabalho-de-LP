import AdminLayout from "../../components/AdminLayout"

const kpis = [
  { label: "Ocupação Atual", value: "77%", desc: "% de quartos ocupados" },
  { label: "Reservas Ativas", value: "28", desc: "número total de reservas" },
  { label: "Receita Total", value: "12 840€", desc: "total do mês ou do dia" },
  { label: "Cancelamentos Recentes", value: "5", desc: "nº de cancelamentos nas últimas 24h" },
]

const receipts = [3200, 3600, 2800, 4100, 5000, 4700, 3900]
const alerts = [
  { label: "Pagamento pendente do cliente X", status: "warning" },
  { label: "Reserva do quarto 102 expira hoje", status: "success" },
  { label: "Cancelamento recente no quarto 203", status: "danger" },
  { label: "...", status: "info" },
]

export default function AdminDashboard() {
  return (
    <AdminLayout title="DASHBOARD" subtitle="Resumo Geral">
      <div className="admin-grid cols-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {kpis.map((item) => (
          <div key={item.label} className="admin-card admin-kpi" style={{ minHeight: "120px" }}>
            <div className="label" style={{ fontWeight: 700, fontSize: "15px" }}>{item.label}</div>
            <div className="value">{item.value}</div>
            <div className="label" style={{ marginTop: "4px" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 style={{ margin: "8px 0 14px", color: "#1f2937", fontSize: "20px", fontWeight: 800 }}>Receitas</h2>
        <div className="admin-card" style={{ borderColor: "#d9e2ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Receitas Recentes</h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <button className="admin-btn primary" style={{ padding: "6px 12px", borderRadius: "6px" }}>Semana</button>
              <button className="admin-btn secondary" style={{ padding: "6px 12px", borderRadius: "6px" }}>Mês</button>
              <button className="admin-btn secondary" style={{ padding: "6px 12px", borderRadius: "6px" }}>Ano</button>
            </div>
          </div>
          <div className="admin-chart-bars" style={{ height: "180px", alignItems: "flex-end" }}>
            {receipts.map((value, idx) => (
              <div key={idx} className="bar" style={{ height: `${Math.max(value / 20, 8)}px` }} />
            ))}
          </div>
          <div className="admin-chart-legend" style={{ justifyContent: "space-between", fontSize: "12px" }}>
            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ margin: "4px 0 14px", color: "#1f2937", fontSize: "20px", fontWeight: 800 }}>Alertas</h2>
        <div className="admin-card" style={{ borderColor: "#d9e2ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Alertas Recentes</h3>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {alerts.map((row) => (
              <div key={row.label} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ flex: 1, background: "#f8fafc", borderRadius: "12px", padding: "6px 10px", fontSize: "13px" }}>
                  {row.label}
                </div>
                <div style={{ width: "90px", background: "#e5e7eb", borderRadius: "12px", overflow: "hidden", height: "14px" }}>
                  <div
                    style={{
                      width: row.status === "danger" ? "80%" : row.status === "success" ? "70%" : "60%",
                      height: "100%",
                      background: row.status === "danger" ? "#ef4444" : row.status === "success" ? "#22c55e" : "#f59e0b",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#f59e0b", borderRadius: "4px" }}></span>Aviso</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#22c55e", borderRadius: "4px" }}></span>Sucesso</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "4px" }}></span>Erro</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
