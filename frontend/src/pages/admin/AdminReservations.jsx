import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../../utils/notify"

export default function AdminReservations() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [clientes, setClientes] = useState([])
  const [clientesLoading, setClientesLoading] = useState(true)
  const [quartos, setQuartos] = useState([])
  const [quartosLoading, setQuartosLoading] = useState(true)

  const [createForm, setCreateForm] = useState({
    utilizador_id: "",
    quarto_id: "",
    data_inicio: "",
    data_fim: "",
  })

  const fetchReservas = async () => {
    try {
      setLoading(true)
      const resp = await api.get("/reservas")
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
      setReservas(data)
    } catch (err) {
      console.error("Erro ao carregar reservas", err)
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setClientesLoading(true)
        const resp = await api.get("/clientes")
        const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
        setClientes(data)
      } catch (err) {
        console.error("Erro ao carregar clientes", err)
        setClientes([])
      } finally {
        setClientesLoading(false)
      }
    }

    const fetchQuartos = async () => {
      try {
        setQuartosLoading(true)
        const resp = await api.get("/quartos")
        const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
        setQuartos(data)
      } catch (err) {
        console.error("Erro ao carregar quartos", err)
        setQuartos([])
      } finally {
        setQuartosLoading(false)
      }
    }

    fetchClientes()
    fetchQuartos()
  }, [])

  const setCreateField = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetCreateForm = () => {
    setCreateForm({ utilizador_id: "", quarto_id: "", data_inicio: "", data_fim: "" })
  }

  const createReserva = async () => {
    if (!createForm.utilizador_id) {
      mostrarErroMensagem("Selecione um cliente.")
      return
    }
    if (!createForm.quarto_id) {
      mostrarErroMensagem("Selecione um quarto.")
      return
    }
    if (!createForm.data_inicio || !createForm.data_fim) {
      mostrarErroMensagem("Indique check-in e check-out.")
      return
    }

    const payload = {
      utilizador_id: Number(createForm.utilizador_id),
      quarto_id: Number(createForm.quarto_id),
      data_inicio: createForm.data_inicio,
      data_fim: createForm.data_fim,
    }

    setCreating(true)
    try {
      const resp = await api.post("/reservas", payload)
      mostrarSucessoMensagem(resp?.data?.message || "Reserva criada com sucesso!")
      resetCreateForm()
      setShowCreate(false)
      await fetchReservas()
    } catch (err) {
      const message = err?.response?.data?.message || "Erro ao criar reserva."
      mostrarErroMensagem(message)
      console.error("Erro ao criar reserva", err)
    } finally {
      setCreating(false)
    }
  }

  const formatEstado = (estado) => {
    const v = (estado || "").toString().toLowerCase()
    if (v === "checkedout") return "Concluída"
    if (v === "cancelado") return "Cancelada"
    if (v === "checkedin") return "Ativa"
    if (v === "confirmado") return "Ativa"
    if (v === "pendente") return "Pendente"
    return estado || "-"
  }

  const badgeTone = (estado) => {
    const label = formatEstado(estado)
    if (label === "Concluída") return "success"
    if (label === "Cancelada") return "danger"
    if (label === "Pendente") return "warning"
    return "warning"
  }

  const formatDate = (value) => {
    if (!value) return "-"
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return String(value)
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  }

  const quartosById = useMemo(() => new Map(quartos.map((q) => [q.id, q])), [quartos])

  return (
    <AdminLayout
      title="Gestão de Reservas"
      subtitle="Reservas por período"
      actions={
        <button
          type="button"
          className="admin-btn primary"
          onClick={() => setShowCreate((v) => !v)}
          disabled={creating}
          style={{ opacity: creating ? 0.7 : 1 }}
        >
          {showCreate ? "Fechar" : "+ Nova Reserva"}
        </button>
      }
    >
      {showCreate ? (
        <div className="admin-card">
          <div className="admin-section-header">
            <h3>Adicionar Reserva</h3>
            <p style={{ margin: 0, color: "#6b7280" }}>Crie uma reserva manualmente</p>
          </div>

          {clientesLoading || quartosLoading ? (
            <p style={{ padding: "12px", color: "#6b7280" }}>A carregar dados...</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!creating) createReserva()
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Cliente</label>
                  <select
                    className="admin-select"
                    value={createForm.utilizador_id}
                    onChange={(e) => setCreateField("utilizador_id", e.target.value)}
                    disabled={creating}
                  >
                    <option value="">Selecione…</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}{c.email ? ` (${c.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Quarto</label>
                  <select
                    className="admin-select"
                    value={createForm.quarto_id}
                    onChange={(e) => setCreateField("quarto_id", e.target.value)}
                    disabled={creating}
                  >
                    <option value="">Selecione…</option>
                    {quartos
                      .slice()
                      .sort((a, b) => (a.numero || 0) - (b.numero || 0))
                      .map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.numero ?? q.id} {q.tipo ? `- ${q.tipo}` : ""}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Check-in</label>
                  <input
                    className="admin-input"
                    type="datetime-local"
                    value={createForm.data_inicio}
                    onChange={(e) => setCreateField("data_inicio", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Check-out</label>
                  <input
                    className="admin-input"
                    type="datetime-local"
                    value={createForm.data_fim}
                    onChange={(e) => setCreateField("data_fim", e.target.value)}
                    disabled={creating}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px" }}>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => {
                    resetCreateForm()
                    setShowCreate(false)
                  }}
                  disabled={creating}
                  style={{ opacity: creating ? 0.7 : 1 }}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-btn primary" disabled={creating} style={{ opacity: creating ? 0.7 : 1 }}>
                  {creating ? "A criar..." : "Criar"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "14px", color: "#6b7280" }}>
                    A carregar reservas...
                  </td>
                </tr>
              ) : reservas.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "14px", color: "#6b7280" }}>
                    Sem reservas.
                  </td>
                </tr>
              ) : (
                reservas.map((res) => {
                  const quarto = res?.quarto_id ? quartosById.get(res.quarto_id) : res?.quarto
                  const quartoNumero = quarto?.numero ?? quarto?.id ?? res?.quarto_id ?? "-"
                  return (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td>{res?.utilizador?.name ?? res?.cliente ?? "-"}</td>
                      <td>{quartoNumero}</td>
                      <td>{formatDate(res?.data_inicio)}</td>
                      <td>{formatDate(res?.data_fim)}</td>
                      <td>
                        <span className={`badge ${badgeTone(res?.estado)}`}>{formatEstado(res?.estado)}</span>
                      </td>
                      <td style={{ textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>Ver · Editar</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
