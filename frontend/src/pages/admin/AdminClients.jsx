import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [query, setQuery] = useState("")
  const [draftById, setDraftById] = useState({})
  const [error, setError] = useState("")

  const formatDate = (value) => {
    if (!value) return "-"
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "-"
    return d.toLocaleDateString("pt-PT")
  }

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError("")
      const resp = await api.get("/clientes")
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
      setClients(data)
      setDraftById(
        Object.fromEntries(
          data.map((c) => [
            c.id,
            {
              name: c.name ?? "",
              email: c.email ?? "",
              ativo: c.ativo ?? true,
            },
          ]),
        ),
      )
    } catch (err) {
      console.error("Erro ao carregar clientes", err)
      const status = err?.response?.status
      setError(status ? `Erro ao carregar clientes (HTTP ${status}).` : "Erro ao carregar clientes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const setDraftField = (id, field, value) => {
    setDraftById((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }))
  }

  const saveClient = async (client) => {
    const draft = draftById[client.id]
    if (!draft) return

    setSavingId(client.id)
    try {
      const resp = await api.put(`/clientes/${client.id}`, {
        name: draft.name,
        email: draft.email,
        ativo: !!draft.ativo,
      })

      const updated = resp?.data?.data
      if (updated && typeof updated === "object") {
        setClients((prev) => prev.map((c) => (c.id === client.id ? updated : c)))
        setDraftById((prev) => ({
          ...prev,
          [client.id]: {
            name: updated.name ?? "",
            email: updated.email ?? "",
            ativo: updated.ativo ?? true,
          },
        }))
      } else {
        await fetchClients()
      }
    } catch (err) {
      console.error("Erro ao atualizar cliente", err)
      await fetchClients()
    } finally {
      setSavingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) => (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q))
  }, [clients, query])

  return (
    <AdminLayout title="Gestão de Clientes" subtitle="Histórico e estado">
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Clientes</h3>
          <input
            className="admin-input"
            placeholder="Pesquisar cliente"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ padding: "12px", color: "#6b7280" }}>A carregar clientes...</p>
        ) : error ? (
          <div style={{ padding: "12px", color: "#b91c1c", display: "flex", alignItems: "center", gap: "12px" }}>
            <span>{error}</span>
            <button type="button" className="admin-btn" onClick={fetchClients}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>#Reservas</th>
                  <th>Última Reserva</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "14px", color: "#6b7280" }}>
                      Sem clientes para mostrar.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input
                          className="admin-input"
                          value={draftById[c.id]?.name ?? c.name ?? ""}
                          onChange={(e) => setDraftField(c.id, "name", e.target.value)}
                          disabled={savingId === c.id}
                        />
                      </td>
                      <td>
                        <input
                          className="admin-input"
                          value={draftById[c.id]?.email ?? c.email ?? ""}
                          onChange={(e) => setDraftField(c.id, "email", e.target.value)}
                          disabled={savingId === c.id}
                        />
                      </td>
                      <td>{c.reservas_count ?? 0}</td>
                      <td>{formatDate(c.ultima_reserva)}</td>
                      <td>
                        <select
                          className="admin-select"
                          value={(draftById[c.id]?.ativo ?? c.ativo) ? "ativo" : "inativo"}
                          onChange={(e) => setDraftField(c.id, "ativo", e.target.value === "ativo")}
                          disabled={savingId === c.id}
                          style={{ minWidth: "140px" }}
                        >
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => saveClient(c)}
                          disabled={savingId === c.id}
                          style={{ opacity: savingId === c.id ? 0.6 : 1 }}
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
