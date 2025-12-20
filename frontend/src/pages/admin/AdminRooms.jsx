import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"

const estadoBadge = (estado) => {
  if ((estado || "").toLowerCase() === "livre") return "success"
  return "danger"
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [draftById, setDraftById] = useState({})

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const resp = await api.get("/quartos")
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
      setRooms(data)
      setDraftById(
        Object.fromEntries(
          data.map((r) => [
            r.id,
            {
              preco_por_dia: r.preco_por_dia ?? "",
              estado: r.estado ?? "livre",
              destaque: !!r.destaque,
              wifi: r.wifi ?? true,
              ar_condicionado: r.ar_condicionado ?? true,
              tv: r.tv ?? true,
            },
          ]),
        ),
      )
    } catch (err) {
      console.error("Erro ao carregar quartos", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const updateRoom = async (id, patch) => {
    setSavingId(id)
    try {
      const resp = await api.put(`/quartos/${id}`, patch)
      const updated = resp?.data?.data
      if (updated && typeof updated === "object") {
        setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)))
        setDraftById((prev) => ({
          ...prev,
          [id]: {
            preco_por_dia: updated.preco_por_dia ?? "",
            estado: updated.estado ?? "livre",
            destaque: !!updated.destaque,
            wifi: updated.wifi ?? true,
            ar_condicionado: updated.ar_condicionado ?? true,
            tv: updated.tv ?? true,
          },
        }))
      } else {
        // fallback: assume patch applied
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
      }
    } catch (err) {
      console.error("Erro ao atualizar quarto", err)
      // Re-sync para não ficar com UI divergente da BD
      await fetchRooms()
    } finally {
      setSavingId(null)
    }
  }

  const setDraftField = (id, field, value) => {
    setDraftById((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }))
  }

  const saveRoom = (room) => {
    const draft = draftById[room.id]
    if (!draft) return

    const patch = {
      preco_por_dia: draft.preco_por_dia === "" ? null : Number(draft.preco_por_dia),
      estado: draft.estado,
      destaque: !!draft.destaque,
      wifi: !!draft.wifi,
      ar_condicionado: !!draft.ar_condicionado,
      tv: !!draft.tv,
    }

    updateRoom(room.id, patch)
  }

  const grid = useMemo(() => {
    const sorted = [...rooms].sort((a, b) => (a.numero || 0) - (b.numero || 0))
    const cols = 8
    const rows = []
    for (let i = 0; i < sorted.length; i += cols) rows.push(sorted.slice(i, i + cols))
    return rows
  }, [rooms])

  return (
    <AdminLayout
      title="Gestão de Quartos"
      subtitle="Inventário, destaque e disponibilidade"
      actions={<button className="admin-btn primary">+ Adicionar Quarto</button>}
    >
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Quartos</h3>
          <div className="admin-filters">
            <input className="admin-input" placeholder="Pesquisar quarto" />
            <select className="admin-select">
              <option>Todos os tipos</option>
              <option>Padrão</option>
              <option>Executivo</option>
              <option>Luxo</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ padding: "12px", color: "#6b7280" }}>A carregar quartos...</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome/Tipo</th>
                  <th>Capacidade</th>
                  <th>Preço</th>
                  <th>Estado</th>
                  <th>Destaque</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.numero || room.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{room.nome || `Quarto ${room.numero}`}</div>
                      <div style={{ color: "#6b7280", fontSize: "12px" }}>{room.tipo}</div>
                    </td>
                    <td>{room.capacidade || "-"}</td>
                    <td>
                      <input
                        className="admin-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={draftById[room.id]?.preco_por_dia ?? room.preco_por_dia ?? ""}
                        onChange={(e) => setDraftField(room.id, "preco_por_dia", e.target.value)}
                        disabled={savingId === room.id}
                        style={{ maxWidth: "120px" }}
                      />
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={draftById[room.id]?.estado ?? room.estado}
                        onChange={(e) => setDraftField(room.id, "estado", e.target.value)}
                        disabled={savingId === room.id}
                        style={{ minWidth: "140px" }}
                      >
                        <option value="livre">Livre</option>
                        <option value="ocupado">Ocupado</option>
                      </select>
                    </td>
                    <td>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="checkbox"
                          checked={!!(draftById[room.id]?.destaque ?? room.destaque)}
                          onChange={() => setDraftField(room.id, "destaque", !(draftById[room.id]?.destaque ?? room.destaque))}
                          disabled={savingId === room.id}
                        />
                        <span style={{ fontSize: "13px", color: "#4b5563" }}>Homepage</span>
                      </label>
                      <div style={{ display: "flex", gap: "10px", marginTop: "8px", color: "#4b5563", fontSize: "12px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <input
                            type="checkbox"
                            checked={!!(draftById[room.id]?.wifi ?? room.wifi ?? true)}
                            onChange={() => setDraftField(room.id, "wifi", !(draftById[room.id]?.wifi ?? room.wifi ?? true))}
                            disabled={savingId === room.id}
                          />
                          Wi‑Fi
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <input
                            type="checkbox"
                            checked={!!(draftById[room.id]?.ar_condicionado ?? room.ar_condicionado ?? true)}
                            onChange={() =>
                              setDraftField(
                                room.id,
                                "ar_condicionado",
                                !(draftById[room.id]?.ar_condicionado ?? room.ar_condicionado ?? true),
                              )
                            }
                            disabled={savingId === room.id}
                          />
                          AC
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <input
                            type="checkbox"
                            checked={!!(draftById[room.id]?.tv ?? room.tv ?? true)}
                            onChange={() => setDraftField(room.id, "tv", !(draftById[room.id]?.tv ?? room.tv ?? true))}
                            disabled={savingId === room.id}
                          />
                          TV
                        </label>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => saveRoom(room)}
                        disabled={savingId === room.id}
                        style={{ opacity: savingId === room.id ? 0.6 : 1 }}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Mapa rápido</h3>
          <p style={{ margin: 0, color: "#6b7280" }}>Clique para alternar livre/ocupado</p>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          {grid.map((row, rIdx) => (
            <div key={rIdx} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: "6px" }}>
              {row.map((room) => (
                <button
                  key={room.id}
                  onClick={() => updateRoom(room.id, { estado: (room.estado || "").toLowerCase() === "livre" ? "ocupado" : "livre" })}
                  disabled={savingId === room.id}
                  style={{
                    height: "42px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    background: (room.estado || "").toLowerCase() === "livre" ? "#22c55e" : "#ef4444",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  {room.numero || room.id}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
