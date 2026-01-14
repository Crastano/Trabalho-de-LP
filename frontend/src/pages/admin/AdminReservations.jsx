import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../../utils/notify"

export default function AdminReservations() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  const [viewReserva, setViewReserva] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [editById, setEditById] = useState({})

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

  const toDatetimeLocal = (value) => {
    if (!value) return ""
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ""
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    const hh = String(d.getHours()).padStart(2, "0")
    const mi = String(d.getMinutes()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  }

  const openView = async (id) => {
    try {
      setViewLoading(true)
      const resp = await api.get(`/reservas/${id}`)
      const data = resp?.data?.data ?? resp?.data
      setViewReserva(data)
    } catch (err) {
      console.error("Erro ao carregar reserva", err)
      mostrarErroMensagem("Erro ao carregar reserva.")
      setViewReserva(null)
    } finally {
      setViewLoading(false)
    }
  }

  const startEdit = (res) => {
    setEditingId(res.id)
    setEditById((prev) => ({
      ...prev,
      [res.id]: {
        estado: (res?.estado || "").toString().toLowerCase() || "confirmado",
        data_inicio: toDatetimeLocal(res?.data_inicio),
        data_fim: toDatetimeLocal(res?.data_fim),
      },
    }))
  }

  const setEditField = (id, field, value) => {
    setEditById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }))
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id) => {
    const form = editById[id]
    if (!form) return

    if (!form.data_inicio || !form.data_fim) {
      mostrarErroMensagem("Indique check-in e check-out.")
      return
    }

    setSavingId(id)
    try {
      const payload = {
        estado: form.estado,
        data_inicio: form.data_inicio,
        data_fim: form.data_fim,
      }
      const resp = await api.put(`/reservas/${id}`, payload)
      mostrarSucessoMensagem(resp?.data?.message || "Reserva atualizada com sucesso!")
      setEditingId(null)
      await fetchReservas()
      if (viewReserva?.id === id) {
        await openView(id)
      }
    } catch (err) {
      console.error("Erro ao atualizar reserva", err)
      const message = err?.response?.data?.message || "Erro ao atualizar reserva."
      mostrarErroMensagem(message)
    } finally {
      setSavingId(null)
    }
  }

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

      {viewLoading ? (
        <div className="admin-card">
          <p style={{ padding: "12px", color: "#6b7280" }}>A carregar detalhe da reserva...</p>
        </div>
      ) : viewReserva ? (
        <div className="admin-card">
          <div className="admin-section-header" style={{ alignItems: "flex-start" }}>
            <div>
              <h3>Reserva #{viewReserva.id}</h3>
              <p style={{ margin: 0, color: "#6b7280" }}>Detalhe rápido (admin)</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="admin-btn" onClick={() => setViewReserva(null)}>
                Fechar
              </button>
              <button
                type="button"
                className="admin-btn primary"
                onClick={() => startEdit(viewReserva)}
                disabled={savingId === viewReserva.id}
                style={{ opacity: savingId === viewReserva.id ? 0.7 : 1 }}
              >
                Editar
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Cliente</div>
              <div style={{ fontWeight: 600 }}>{viewReserva?.utilizador?.name ?? viewReserva?.cliente ?? "-"}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Quarto</div>
              <div style={{ fontWeight: 600 }}>{viewReserva?.quarto?.numero ?? viewReserva?.quarto_id ?? "-"}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Check-in</div>
              <div style={{ fontWeight: 600 }}>{formatDate(viewReserva?.data_inicio)}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Check-out</div>
              <div style={{ fontWeight: 600 }}>{formatDate(viewReserva?.data_fim)}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Estado</div>
              <div style={{ fontWeight: 600 }}>{formatEstado(viewReserva?.estado)}</div>
            </div>
          </div>
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
                  const isEditing = editingId === res.id
                  const edit = editById[res.id]
                  return (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td>{res?.utilizador?.name ?? res?.cliente ?? "-"}</td>
                      <td>{quartoNumero}</td>
                      <td>
                        {isEditing ? (
                          <input
                            className="admin-input"
                            type="datetime-local"
                            value={edit?.data_inicio ?? toDatetimeLocal(res?.data_inicio)}
                            onChange={(e) => setEditField(res.id, "data_inicio", e.target.value)}
                            disabled={savingId === res.id}
                            style={{ maxWidth: "200px" }}
                          />
                        ) : (
                          formatDate(res?.data_inicio)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="admin-input"
                            type="datetime-local"
                            value={edit?.data_fim ?? toDatetimeLocal(res?.data_fim)}
                            onChange={(e) => setEditField(res.id, "data_fim", e.target.value)}
                            disabled={savingId === res.id}
                            style={{ maxWidth: "200px" }}
                          />
                        ) : (
                          formatDate(res?.data_fim)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="admin-select"
                            value={edit?.estado ?? (res?.estado || "confirmado")}
                            onChange={(e) => setEditField(res.id, "estado", e.target.value)}
                            disabled={savingId === res.id}
                            style={{ minWidth: "150px" }}
                          >
                            <option value="confirmado">Confirmado</option>
                            <option value="pendente">Pendente</option>
                            <option value="checkedin">Checked-in</option>
                            <option value="checkedout">Checked-out</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        ) : (
                          <span className={`badge ${badgeTone(res?.estado)}`}>{formatEstado(res?.estado)}</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              type="button"
                              className="admin-btn"
                              onClick={cancelEdit}
                              disabled={savingId === res.id}
                              style={{ opacity: savingId === res.id ? 0.7 : 1 }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              className="admin-btn primary"
                              onClick={() => saveEdit(res.id)}
                              disabled={savingId === res.id}
                              style={{ opacity: savingId === res.id ? 0.7 : 1 }}
                            >
                              Guardar
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button type="button" className="admin-btn" onClick={() => openView(res.id)}>
                              Ver
                            </button>
                            <button type="button" className="admin-btn" onClick={() => startEdit(res)}>
                              Editar
                            </button>
                          </div>
                        )}
                      </td>
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
