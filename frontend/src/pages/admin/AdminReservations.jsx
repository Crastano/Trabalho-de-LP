import AdminLayout from "../../components/AdminLayout"

const reservas = [
  { id: 1, cliente: "Ana Silva", quarto: "201", checkin: "01/10", checkout: "05/10", estado: "Concluída" },
  { id: 2, cliente: "João Costa", quarto: "205", checkin: "02/10", checkout: "06/10", estado: "Cancelada" },
  { id: 3, cliente: "Maria Dias", quarto: "207", checkin: "04/10", checkout: "07/10", estado: "Ativa" },
  { id: 4, cliente: "Bruno Lima", quarto: "210", checkin: "05/10", checkout: "09/10", estado: "Ativa" },
  { id: 5, cliente: "Sofia Melo", quarto: "203", checkin: "03/10", checkout: "08/10", estado: "Concluída" },
]

export default function AdminReservations() {
  const badgeTone = (estado) => {
    if (estado === "Concluída") return "success"
    if (estado === "Cancelada") return "danger"
    return "warning"
  }

  return (
    <AdminLayout
      title="Gestão de Reservas"
      subtitle="Reservas por período"
      actions={<button className="admin-btn primary">+ Nova Reserva</button>}
    >
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Reservas</h3>
          <div className="admin-filters">
            <input className="admin-input" placeholder="Data inicial / final" />
            <select className="admin-select">
              <option>Todos os estados</option>
              <option>Ativa</option>
              <option>Concluída</option>
              <option>Cancelada</option>
            </select>
          </div>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Quarto</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((res) => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.cliente}</td>
                  <td>{res.quarto}</td>
                  <td>{res.checkin}</td>
                  <td>{res.checkout}</td>
                  <td>
                    <span className={`badge ${badgeTone(res.estado)}`}>{res.estado}</span>
                  </td>
                  <td style={{ textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>Ver · Editar</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
