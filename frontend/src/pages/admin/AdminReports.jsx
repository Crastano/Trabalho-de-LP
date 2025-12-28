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
const msDay = 24 * 60 * 60 * 1000

const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

const quartoTipoLabel = (tipo) => {
  const t = (tipo || "").toString().toLowerCase()
  if (t === "executivo") return "Executivo"
  if (t === "luxo") return "Luxo"
  if (t === "padrao") return "Padrão"
  return tipo || ""
}

const isReservaConfirmada = (estado) => {
  const e = (estado || "").toString().toLowerCase()
  return e === "confirmado" || e === "checkedin" || e === "checkedout"
}

const overlapNights = (start, end, rangeStart, rangeEnd) => {
  const s = startOfDay(start)
  const e = startOfDay(end)
  const rs = startOfDay(rangeStart)
  const re = startOfDay(rangeEnd)
  const oStart = s > rs ? s : rs
  const oEnd = e < re ? e : re
  const diff = (oEnd - oStart) / msDay
  return diff > 0 ? diff : 0
}

export default function AdminReports() {
  const now = useMemo(() => new Date(), [])
  const [loading, setLoading] = useState(true)
  const [pagamentos, setPagamentos] = useState([])
  const [reservas, setReservas] = useState([])
  const [quartos, setQuartos] = useState([])
  const [modo, setModo] = useState("mes") // mes | ano
  const [mesSelecionado, setMesSelecionado] = useState(now.getMonth())

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([api.get("/pagamentos"), api.get("/reservas"), api.get("/quartos")])
      .then(([p, r, q]) => {
        if (!active) return
        setPagamentos(Array.isArray(p.data) ? p.data : [])
        setReservas(Array.isArray(r.data) ? r.data : [])
        setQuartos(Array.isArray(q.data) ? q.data : [])
      })
      .catch(() => {
        if (!active) return
        mostrarErroMensagem("Não foi possível carregar os relatórios.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const year = now.getFullYear()
  const period = useMemo(() => {
    if (modo === "ano") {
      const start = new Date(year, 0, 1)
      const end = new Date(year + 1, 0, 1)
      return { start, end, label: "Ano" }
    }
    const start = new Date(year, mesSelecionado, 1)
    const end = new Date(year, mesSelecionado + 1, 1)
    return { start, end, label: monthLabels[mesSelecionado] }
  }, [modo, mesSelecionado, year])

  const paidPayments = useMemo(() => {
    return pagamentos
      .filter((p) => (p?.estado || "").toString().toLowerCase() === "pago")
      .map((p) => {
        const when = toDate(p?.pago_em) || toDate(p?.created_at)
        const valor = Number(p?.valor) || 0
        return { when, valor }
      })
      .filter((x) => x.when && x.valor > 0)
  }, [pagamentos])

  const receitaTotal = useMemo(() => {
    return paidPayments
      .filter((p) => p.when >= period.start && p.when < period.end)
      .reduce((acc, p) => acc + p.valor, 0)
  }, [paidPayments, period])

  const chartData = useMemo(() => {
    if (modo === "ano") {
      const values = Array(12).fill(0)
      for (const p of paidPayments) {
        if (p.when < period.start || p.when >= period.end) continue
        values[p.when.getMonth()] += p.valor
      }
      return { labels: monthLabels, values }
    }

    // mês: agrupa por semana do mês (1..5)
    const maxWeek = 5
    const labels = Array.from({ length: maxWeek }, (_, i) => `Sem ${i + 1}`)
    const values = Array(maxWeek).fill(0)
    for (const p of paidPayments) {
      if (p.when < period.start || p.when >= period.end) continue
      const week = clamp(Math.ceil(p.when.getDate() / 7), 1, maxWeek)
      values[week - 1] += p.valor
    }
    return { labels, values }
  }, [modo, paidPayments, period])

  const hasChartValues = useMemo(() => chartData.values.some((v) => v > 0), [chartData])
  const chartBars = useMemo(() => {
    if (!hasChartValues) return []
    const max = Math.max(...chartData.values, 1)
    return chartData.values.map((v) => Math.max((v / max) * 72, 10))
  }, [hasChartValues, chartData])

  const ocupacaoMedia = useMemo(() => {
    const roomsCount = quartos.length
    if (!roomsCount) return null

    const totalDays = (startOfDay(period.end) - startOfDay(period.start)) / msDay
    if (!totalDays) return null

    const reservasNoPeriodo = reservas
      .filter((r) => isReservaConfirmada(r?.estado))
      .map((r) => {
        const ini = toDate(r?.data_inicio)
        const fim = toDate(r?.data_fim)
        return { ini, fim }
      })
      .filter((r) => r.ini && r.fim)

    let reservedNights = 0
    for (const r of reservasNoPeriodo) {
      reservedNights += overlapNights(r.ini, r.fim, period.start, period.end)
    }

    const available = roomsCount * totalDays
    if (!available) return null

    const pct = (reservedNights / available) * 100
    if (!Number.isFinite(pct) || pct <= 0) return 0
    return Math.round(pct)
  }, [quartos, reservas, period])

  const topQuartos = useMemo(() => {
    const map = new Map()

    for (const r of reservas) {
      if (!isReservaConfirmada(r?.estado)) continue
      const ini = toDate(r?.data_inicio)
      const fim = toDate(r?.data_fim)
      if (!ini || !fim) continue
      if (fim <= period.start || ini >= period.end) continue

      const nights = overlapNights(ini, fim, period.start, period.end)
      if (nights <= 0) continue

      const quartoId = r?.quarto_id
      if (!quartoId) continue

      const existing = map.get(quartoId) || { nights: 0, quarto: r?.quarto || null }
      existing.nights += nights
      if (!existing.quarto && r?.quarto) existing.quarto = r.quarto
      map.set(quartoId, existing)
    }

    const entries = Array.from(map.entries())
      .map(([id, v]) => {
        const fallback = quartos.find((q) => q?.id === id) || null
        const quarto = v.quarto || fallback
        return { id, nights: v.nights, quarto }
      })
      .sort((a, b) => b.nights - a.nights)
      .slice(0, 3)

    return entries
  }, [reservas, quartos, period])

  const hasTopQuartos = topQuartos.length > 0
  const receitaTotalFmt = useMemo(() => {
    const value = Math.round((receitaTotal + Number.EPSILON) * 100) / 100
    const formatted = new Intl.NumberFormat("pt-PT").format(value)
    return `${formatted}€`
  }, [receitaTotal])

  return (
    <AdminLayout title="Relatórios" subtitle="Visão consolidada">
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>Receitas</h3>
          <div className="admin-filters">
            <select className="admin-select" value={modo} onChange={(e) => setModo(e.target.value)}>
              <option value="mes">Receitas (Mês)</option>
              <option value="ano">Receitas (Ano)</option>
            </select>
            <select className="admin-select" value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))} disabled={modo === "ano"}>
              {monthLabels.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "14px", color: "#6b7280" }}>A carregar...</div>
        ) : !hasChartValues ? (
          <div style={{ padding: "14px", color: "#6b7280" }}>Sem receitas registadas para {period.label}.</div>
        ) : (
          <>
            <div className="admin-chart-bars">
              {chartBars.map((h, idx) => (
                <div key={idx} className="bar info" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="admin-chart-legend">
              {chartData.labels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="admin-grid cols-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="admin-card">
          <h3>Ocupação média</h3>
          <p>Baseada nas reservas confirmadas.</p>
          {loading ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>A carregar...</div>
          ) : ocupacaoMedia === null ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>Sem dados.</div>
          ) : (
            <div style={{ marginTop: "12px", fontWeight: 700, fontSize: "22px", color: "#1d4ed8" }}>{ocupacaoMedia}%</div>
          )}
        </div>
        <div className="admin-card">
          <h3>Receita total</h3>
          <p>Soma de vendas no período.</p>
          {loading ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>A carregar...</div>
          ) : receitaTotal <= 0 ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>Sem dados.</div>
          ) : (
            <div style={{ marginTop: "12px", fontWeight: 700, fontSize: "22px", color: "#16a34a" }}>{receitaTotalFmt}</div>
          )}
        </div>
        <div className="admin-card">
          <h3>Quartos mais reservados</h3>
          <p>{modo === "ano" ? "Top 3 do ano." : "Top 3 do mês."}</p>
          {loading ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>A carregar...</div>
          ) : !hasTopQuartos ? (
            <div style={{ marginTop: "12px", color: "#6b7280" }}>Sem dados.</div>
          ) : (
            <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {topQuartos.map((item) => {
                const numero = item?.quarto?.numero ?? item.id
                const tipo = quartoTipoLabel(item?.quarto?.tipo)
                return (
                  <li key={item.id}>
                    <span className="pill">#{numero} {tipo}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
