import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/AdminLayout"
import api from "../../api/api"
import { mostrarErroMensagem } from "../../utils/notify"

const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const toDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

const getWeekStartMonday = (d) => {
  const day = d.getDay() // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day
  return startOfDay(addDays(d, diff))
}

export default function AdminPayments() {
  const [pagamentos, setPagamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState(null)
  const [receitasPeriodo, setReceitasPeriodo] = useState("ano")

  const fetchPagamentos = async () => {
    try {
      setLoading(true)
      const resp = await api.get("/pagamentos")
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
      setPagamentos(data)
    } catch (err) {
      console.error("Erro ao carregar pagamentos", err)
      setPagamentos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPagamentos()
  }, [])

  const formatEstado = (estado) => {
    const v = (estado || "").toString().toLowerCase()
    if (v === "pago") return "Pago"
    if (v === "pendente") return "Pendente"
    if (v === "reembolsado") return "Reembolsado"
    return estado || "-"
  }

  const tone = (estado) => {
    const label = formatEstado(estado)
    if (label === "Pago") return "success"
    if (label === "Pendente") return "warning"
    return "danger"
  }

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(Number(value) || 0)

  const downloadFatura = async (id) => {
    if (!id) {
      mostrarErroMensagem("Selecione um pagamento válido.")
      return
    }
    setDownloadingId(id)
    try {
      const resp = await api.get(`/pagamentos/${id}/fatura`, { responseType: "blob" })
      const blob = new Blob([resp.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fatura_pagamento_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const message = err?.response?.data?.message || "Erro ao gerar a fatura em PDF."
      mostrarErroMensagem(message)
      console.error("Erro ao gerar fatura", err)
    } finally {
      setDownloadingId(null)
    }
  }

  const latestPaymentId = useMemo(() => {
    if (!pagamentos.length) return null
    return pagamentos[0]?.id ?? null
  }, [pagamentos])

  const receitasData = useMemo(() => {
    const paid = pagamentos
      .filter((p) => (p?.estado || "").toString().toLowerCase() === "pago")
      .map((p) => {
        const when = toDate(p?.pago_em) || toDate(p?.created_at) || null
        const valor = Number(p?.valor) || 0
        return { when, valor }
      })
      .filter((x) => x.when && x.valor > 0)

    const now = new Date()

    if (receitasPeriodo === "semana") {
      const weekStart = getWeekStartMonday(now)
      const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
      const values = Array(7).fill(0)
      const weekEnd = addDays(weekStart, 7)

      for (const item of paid) {
        if (item.when < weekStart || item.when >= weekEnd) continue
        const idx = Math.floor((startOfDay(item.when) - weekStart) / (24 * 60 * 60 * 1000))
        if (idx >= 0 && idx < 7) values[idx] += item.valor
      }

      return { labels, values }
    }

    if (receitasPeriodo === "mes") {
      const maxWeek = 5
      const labels = Array.from({ length: maxWeek }, (_, i) => `Sem ${i + 1}`)
      const values = Array(maxWeek).fill(0)

      const start = startOfDay(addDays(now, -29))
      const end = addDays(start, 30)

      for (const item of paid) {
        if (item.when < start || item.when >= end) continue
        const idx = Math.floor((startOfDay(item.when) - start) / (7 * 24 * 60 * 60 * 1000))
        const bucket = Math.min(Math.max(idx, 0), maxWeek - 1)
        values[bucket] += item.valor
      }

      return { labels, values }
    }

    // ano (padrão): 12 meses do ano atual
    const year = now.getFullYear()
    const labels = monthLabels
    const values = Array(12).fill(0)
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year + 1, 0, 1)

    for (const item of paid) {
      if (item.when < yearStart || item.when >= yearEnd) continue
      const m = item.when.getMonth()
      values[m] += item.valor
    }

    return { labels, values }
  }, [pagamentos, receitasPeriodo])

  const hasReceitas = useMemo(() => receitasData.values.some((v) => v > 0), [receitasData])

  const chartBars = useMemo(() => {
    if (!hasReceitas) return []
    const max = Math.max(...receitasData.values, 1)
    // Mantém um mínimo visual (8px) como no mock, mas só quando há receitas
    return receitasData.values.map((v) => Math.max((v / max) * 72, 8))
  }, [hasReceitas, receitasData])

  return (
    <AdminLayout
      title="Pagamentos"
      subtitle="Receitas e faturas"
      actions={
        <button
          type="button"
          className="admin-btn primary"
          onClick={() => downloadFatura(latestPaymentId)}
          disabled={!latestPaymentId || downloadingId !== null}
          style={{ opacity: !latestPaymentId || downloadingId !== null ? 0.7 : 1 }}
        >
          Gerar Fatura
        </button>
      }
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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "14px", color: "#6b7280" }}>
                    A carregar pagamentos...
                  </td>
                </tr>
              ) : pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "14px", color: "#6b7280" }}>
                    Sem pagamentos.
                  </td>
                </tr>
              ) : (
                pagamentos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p?.reserva?.utilizador?.name ?? "-"}</td>
                    <td>#{p?.reserva?.id ?? p?.reserva_id ?? "-"}</td>
                    <td>{formatCurrency(p?.valor)}</td>
                    <td>
                      <span className={`badge ${tone(p?.estado)}`}>{formatEstado(p?.estado)}</span>
                    </td>
                    <td>{p?.metodo ?? "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => downloadFatura(p.id)}
                        disabled={downloadingId !== null}
                        style={{ color: "#1d4ed8", fontWeight: 700, opacity: downloadingId !== null ? 0.7 : 1 }}
                      >
                        {downloadingId === p.id ? "A gerar..." : "Ver"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-header">
          <div>
            <h3>Receitas</h3>
            <p>{receitasPeriodo === "ano" ? "Ano" : receitasPeriodo === "mes" ? "Últimos 30 dias" : "Semana"}</p>
          </div>
          <div className="admin-filters">
            <select className="admin-select" value={receitasPeriodo} onChange={(e) => setReceitasPeriodo(e.target.value)}>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
            </select>
          </div>
        </div>
        {!hasReceitas ? (
          <div style={{ padding: "14px", color: "#6b7280" }}>Sem receitas registadas para este período.</div>
        ) : (
          <>
            <div className="admin-chart-bars">
              {chartBars.map((h, idx) => (
                <div key={idx} className="bar" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="admin-chart-legend">
              {receitasData.labels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
