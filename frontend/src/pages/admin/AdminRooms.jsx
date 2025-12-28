import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"
import { mostrarErroMensagem, mostrarSucessoMensagem } from "../../utils/notify"

const estadoBadge = (estado) => {
  if ((estado || "").toLowerCase() === "livre") return "success"
  return "danger"
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [draftById, setDraftById] = useState({})

  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [andares, setAndares] = useState([])
  const [andaresLoading, setAndaresLoading] = useState(true)
  const [createForm, setCreateForm] = useState({
    numero: "",
    andar_id: "",
    tipo: "padrao",
    capacidade: "",
    estado: "livre",
    preco_por_dia: "",
    posicao_x: "",
    posicao_y: "",
    imagem: "",
    destaque: false,
    camas: "",
    wifi: true,
    ar_condicionado: true,
    tv: true,
    descricao: "",
  })

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

  useEffect(() => {
    const fetchAndares = async () => {
      try {
        setAndaresLoading(true)
        const resp = await api.get("/andares")
        const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
        setAndares(data)
      } catch (err) {
        console.error("Erro ao carregar andares", err)
        setAndares([])
      } finally {
        setAndaresLoading(false)
      }
    }

    fetchAndares()
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

  const setCreateField = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetCreateForm = () => {
    setCreateForm({
      numero: "",
      andar_id: "",
      tipo: "padrao",
      capacidade: "",
      estado: "livre",
      preco_por_dia: "",
      posicao_x: "",
      posicao_y: "",
      imagem: "",
      destaque: false,
      camas: "",
      wifi: true,
      ar_condicionado: true,
      tv: true,
      descricao: "",
    })
  }

  const createRoom = async () => {
    const numero = Number(createForm.numero)
    const capacidade = Number(createForm.capacidade)
    const preco_por_dia = Number(createForm.preco_por_dia)

    if (!Number.isFinite(numero) || numero <= 0) {
      mostrarErroMensagem("Número do quarto inválido.")
      return
    }
    if (!createForm.andar_id) {
      mostrarErroMensagem("Selecione um andar.")
      return
    }
    if (!Number.isFinite(capacidade) || capacidade <= 0) {
      mostrarErroMensagem("Capacidade inválida.")
      return
    }
    if (!Number.isFinite(preco_por_dia) || preco_por_dia < 0) {
      mostrarErroMensagem("Preço por dia inválido.")
      return
    }

    const payload = {
      numero,
      andar_id: Number(createForm.andar_id),
      tipo: createForm.tipo,
      capacidade,
      estado: createForm.estado,
      preco_por_dia,
      posicao_x: createForm.posicao_x === "" ? null : Number(createForm.posicao_x),
      posicao_y: createForm.posicao_y === "" ? null : Number(createForm.posicao_y),
      imagem: createForm.imagem || null,
      destaque: !!createForm.destaque,
      camas: createForm.camas || null,
      wifi: !!createForm.wifi,
      ar_condicionado: !!createForm.ar_condicionado,
      tv: !!createForm.tv,
      descricao: createForm.descricao || null,
    }

    setCreating(true)
    try {
      const resp = await api.post("/quartos", payload)
      mostrarSucessoMensagem(resp?.data?.message || "Quarto criado com sucesso!")
      resetCreateForm()
      setShowCreate(false)
      await fetchRooms()
    } catch (err) {
      const message = err?.response?.data?.message || "Erro ao criar quarto."
      mostrarErroMensagem(message)
      console.error("Erro ao criar quarto", err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout
      title="Gestão de Quartos"
      subtitle="Inventário, destaque e disponibilidade"
      actions={
        <button
          type="button"
          className="admin-btn primary"
          onClick={() => setShowCreate((v) => !v)}
          disabled={creating}
          style={{ opacity: creating ? 0.7 : 1 }}
        >
          {showCreate ? "Fechar" : "+ Adicionar Quarto"}
        </button>
      }
    >
      {showCreate ? (
        <div className="admin-card">
          <div className="admin-section-header">
            <h3>Adicionar Quarto</h3>
            <p style={{ margin: 0, color: "#6b7280" }}>Crie um novo quarto no sistema</p>
          </div>

          {andaresLoading ? (
            <p style={{ padding: "12px", color: "#6b7280" }}>A carregar andares...</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!creating) createRoom()
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Número</label>
                  <input
                    className="admin-input"
                    type="number"
                    min="1"
                    value={createForm.numero}
                    onChange={(e) => setCreateField("numero", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Andar</label>
                  <select
                    className="admin-select"
                    value={createForm.andar_id}
                    onChange={(e) => setCreateField("andar_id", e.target.value)}
                    disabled={creating}
                  >
                    <option value="">Selecione…</option>
                    {andares.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label ?? `Andar ${a.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Tipo</label>
                  <select
                    className="admin-select"
                    value={createForm.tipo}
                    onChange={(e) => setCreateField("tipo", e.target.value)}
                    disabled={creating}
                  >
                    <option value="padrao">Padrão</option>
                    <option value="executivo">Executivo</option>
                    <option value="luxo">Luxo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Capacidade</label>
                  <input
                    className="admin-input"
                    type="number"
                    min="1"
                    value={createForm.capacidade}
                    onChange={(e) => setCreateField("capacidade", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Preço por dia (€)</label>
                  <input
                    className="admin-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={createForm.preco_por_dia}
                    onChange={(e) => setCreateField("preco_por_dia", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Estado</label>
                  <select
                    className="admin-select"
                    value={createForm.estado}
                    onChange={(e) => setCreateField("estado", e.target.value)}
                    disabled={creating}
                  >
                    <option value="livre">Livre</option>
                    <option value="ocupado">Ocupado</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Posição X (opcional)</label>
                  <input
                    className="admin-input"
                    type="number"
                    value={createForm.posicao_x}
                    onChange={(e) => setCreateField("posicao_x", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Posição Y (opcional)</label>
                  <input
                    className="admin-input"
                    type="number"
                    value={createForm.posicao_y}
                    onChange={(e) => setCreateField("posicao_y", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Imagem URL (opcional)</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={createForm.imagem}
                    onChange={(e) => setCreateField("imagem", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Camas (opcional)</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={createForm.camas}
                    onChange={(e) => setCreateField("camas", e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "6px" }}>Descrição (opcional)</label>
                  <textarea
                    className="admin-input"
                    value={createForm.descricao}
                    onChange={(e) => setCreateField("descricao", e.target.value)}
                    disabled={creating}
                    style={{ width: "100%", minHeight: "92px", resize: "vertical" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#374151", fontSize: "13px" }}>
                    <input
                      type="checkbox"
                      checked={!!createForm.destaque}
                      onChange={() => setCreateField("destaque", !createForm.destaque)}
                      disabled={creating}
                    />
                    Homepage (destaque)
                  </label>

                  <div style={{ display: "flex", gap: "14px", marginTop: "10px", color: "#4b5563", fontSize: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="checkbox"
                        checked={!!createForm.wifi}
                        onChange={() => setCreateField("wifi", !createForm.wifi)}
                        disabled={creating}
                      />
                      Wi‑Fi
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="checkbox"
                        checked={!!createForm.ar_condicionado}
                        onChange={() => setCreateField("ar_condicionado", !createForm.ar_condicionado)}
                        disabled={creating}
                      />
                      AC
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="checkbox"
                        checked={!!createForm.tv}
                        onChange={() => setCreateField("tv", !createForm.tv)}
                        disabled={creating}
                      />
                      TV
                    </label>
                  </div>
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
