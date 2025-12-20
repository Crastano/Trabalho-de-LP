import AdminLayout from "../../components/AdminLayout"

const pagamentos = [
  { id: 1, cliente: "Ana Silva", reserva: "#101", valor: "130€", estado: "Pago", metodo: "Cartão" },
  { id: 2, cliente: "Bruno Lima", reserva: "#102", valor: "110€", estado: "Cancelado", metodo: "MbWay" },
  { id: 3, cliente: "João Dias", reserva: "#103", valor: "120€", estado: "Pendente", metodo: "Cartão" },
  { id: 4, cliente: "Maria Costa", reserva: "#104", valor: "150€", estado: "Pago", metodo: "Cartão" },
  { id: 5, cliente: "Sofia Melo", reserva: "#105", valor: "90€", estado: "Pago", metodo: "Cartão" },
  { id: 6, cliente: "Tiago Rocha", reserva: "#106", valor: "115€", estado: "Pendente", metodo: "MbWay" },
]

const receitaMensal = [32, 44, 40, 52, 58, 63, 59, 66, 61, 64, 70, 72]

export default function AdminPayments() {
  const tone = (estado) => {
    if (estado === "Pago") return "success"
    if (estado === "Pendente") return "warning"
    return "danger"
  }

  return (
    <AdminLayout
      title="Pagamentos"
      subtitle="Receitas e faturas"
      actions={<button className="admin-btn primary">Gerar Fatura</button>}
    >
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Pagamentos</h3>
          <div className="admin-filters">
            <input className="admin-input" placeholder="Data inicial / final" />
            <select className="admin-select">
              <option>Todos os estados</option>
              <option>Pago</option>
              <option>Pendente</option>
              <option>Cancelado</option>
            </select>
            <button className="admin-btn secondary">Filtrar</button>
          </div>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Reserva</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Método</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.cliente}</td>
                  <td>{p.reserva}</td>
                  <td>{p.valor}</td>
                  <td><span className={`badge ${tone(p.estado)}`}>{p.estado}</span></td>
                  <td>{p.metodo}</td>
                  <td style={{ textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>Ver</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-header">
          <div>
            <h3>Receitas</h3>
            <p>12 meses</p>
          </div>
        </div>
        <div className="admin-chart-bars">
          {receitaMensal.map((v, idx) => (
            <div key={idx} className="bar" style={{ height: `${Math.max(v, 8)}px` }} />
          ))}
        </div>
        <div className="admin-chart-legend">
          <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
        </div>
      </div>
    </AdminLayout>
  )
}
