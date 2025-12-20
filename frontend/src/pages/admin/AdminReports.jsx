import AdminLayout from "../../components/AdminLayout"

const receitas = [28, 34, 30, 42, 50, 55, 49, 60, 57, 62, 68, 71]
const ocupacao = 67

export default function AdminReports() {
  return (
    <AdminLayout title="Relatórios" subtitle="Visão consolidada">
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Receitas</h3>
          <div className="admin-filters">
            <select className="admin-select">
              <option>Ocupação (Mês)</option>
              <option>Ocupação (Ano)</option>
            </select>
            <select className="admin-select">
              <option>Jan</option>
              <option>Fev</option>
              <option>Mar</option>
              <option>Abr</option>
              <option>Mai</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Ago</option>
              <option>Set</option>
              <option>Out</option>
              <option>Nov</option>
              <option>Dez</option>
            </select>
          </div>
        </div>
        <div className="admin-chart-bars">
          {receitas.map((v, idx) => (
            <div key={idx} className="bar info" style={{ height: `${Math.max(v, 10)}px` }} />
          ))}
        </div>
        <div className="admin-chart-legend">
          <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
        </div>
      </div>

      <div className="admin-grid cols-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="admin-card">
          <h3>Ocupação média</h3>
          <p>Baseada nas reservas confirmadas.</p>
          <div style={{ marginTop: "12px", fontWeight: 700, fontSize: "22px", color: "#1d4ed8" }}>{ocupacao}%</div>
        </div>
        <div className="admin-card">
          <h3>Receita total</h3>
          <p>Soma de vendas no período.</p>
          <div style={{ marginTop: "12px", fontWeight: 700, fontSize: "22px", color: "#16a34a" }}>12 840€</div>
        </div>
        <div className="admin-card">
          <h3>Quartos mais reservados</h3>
          <p>Top 3 do mês.</p>
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><span className="pill">#201 Executivo</span></li>
            <li><span className="pill">#105 Luxo</span></li>
            <li><span className="pill">#304 Padrão</span></li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
