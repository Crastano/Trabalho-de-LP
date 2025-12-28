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

const isReservaAtiva = (r, now) => {
  const estado = (r?.estado || "").toString().toLowerCase()
  if (estado === "cancelado") return false
  const fim = toDate(r?.data_fim)
  if (!fim) return false
  return fim >= now
}

const isReservaConfirmada = (estado) => {
  const e = (estado || "").toString().toLowerCase()
  return e === "confirmado" || e === "checkedin" || e === "checkedout"
}

const sameDay = (a, b) => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function AdminDashboard() {
  const now = useMemo(() => new Date(), [])
  const [loading, setLoading] = useState(true)
  const [pagamentos, setPagamentos] = useState([])
  const [reservas, setReservas] = useState([])
  const [quartos, setQuartos] = useState([])
  const [receitasPeriodo, setReceitasPeriodo] = useState("semana") // semana | mes | ano

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
        mostrarErroMensagem("Não foi possível carregar o dashboard.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const kpiValues = useMemo(() => {
    const totalQuartos = quartos.length
    const ocupados = quartos.filter((q) => (q?.estado || "").toString().toLowerCase() === "ocupado").length
    const ocupacaoAtual = totalQuartos ? Math.round((ocupados / totalQuartos) * 100) : null

    const reservasAtivas = reservas.filter((r) => isReservaAtiva(r, now)).length

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const receitaMes = pagamentos
      .filter((p) => (p?.estado || "").toString().toLowerCase() === "pago")
      .map((p) => ({ when: toDate(p?.pago_em) || toDate(p?.created_at), valor: Number(p?.valor) || 0 }))
      .filter((x) => x.when && x.valor > 0)
      .filter((x) => x.when >= monthStart && x.when < monthEnd)
      .reduce((acc, x) => acc + x.valor, 0)

    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const cancelamentosRecentes = reservas.filter((r) => {
      const estado = (r?.estado || "").toString().toLowerCase()
      if (estado !== "cancelado") return false
      const when = toDate(r?.updated_at) || toDate(r?.created_at)
      return when && when >= since
    }).length

    const receitaMesFmt = receitaMes > 0 ? `${new Intl.NumberFormat("pt-PT").format(Math.round(receitaMes * 100) / 100)}€` : null

    return {
      ocupacaoAtual,
      reservasAtivas: reservasAtivas || null,
      receitaMesFmt,
      cancelamentosRecentes: cancelamentosRecentes || null,
    }
  }, [quartos, reservas, pagamentos, now])

  const receiptsData = useMemo(() => {
    const paid = pagamentos
      .filter((p) => (p?.estado || "").toString().toLowerCase() === "pago")
      .map((p) => ({ when: toDate(p?.pago_em) || toDate(p?.created_at), valor: Number(p?.valor) || 0 }))
      .filter((x) => x.when && x.valor > 0)

    if (receitasPeriodo === "semana") {
      const weekStart = getWeekStartMonday(now)
      const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
      const values = Array(7).fill(0)
      const weekEnd = addDays(weekStart, 7)
      for (const item of paid) {
        if (item.when < weekStart || item.when >= weekEnd) continue
        const idx = Math.floor((startOfDay(item.when) - weekStart) / msDay)
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
        const idx = Math.floor((startOfDay(item.when) - start) / (7 * msDay))
        const bucket = Math.min(Math.max(idx, 0), maxWeek - 1)
        values[bucket] += item.valor
      }

      return { labels, values }
    }

    // ano
    const labels = monthLabels
    const values = Array(12).fill(0)
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
    for (const item of paid) {
      if (item.when < yearStart || item.when >= yearEnd) continue
      values[item.when.getMonth()] += item.valor
    }
    return { labels, values }
  }, [pagamentos, receitasPeriodo, now])

  const hasReceipts = useMemo(() => receiptsData.values.some((v) => v > 0), [receiptsData])
  const receiptBars = useMemo(() => {
    if (!hasReceipts) return []
    const max = Math.max(...receiptsData.values, 1)
    return receiptsData.values.map((v) => Math.max(v / max * 160, 8))
  }, [hasReceipts, receiptsData])

  const alerts = useMemo(() => {
    const list = []

    const pending = pagamentos
      .filter((p) => (p?.estado || "").toString().toLowerCase() === "pendente")
      .map((p) => {
        const when = toDate(p?.created_at)
        return { p, when }
      })
      .sort((a, b) => (b.when?.getTime?.() || 0) - (a.when?.getTime?.() || 0))[0]

    if (pending?.p) {
      const name = pending.p?.reserva?.utilizador?.name || "cliente"
      list.push({ label: `Pagamento pendente do cliente ${name}`, status: "warning" })
    }

    const expiraHoje = reservas
      .filter((r) => isReservaConfirmada(r?.estado))
      .map((r) => ({ r, fim: toDate(r?.data_fim) }))
      .filter((x) => x.fim && sameDay(x.fim, now))
      .sort((a, b) => a.fim - b.fim)[0]

    if (expiraHoje?.r) {
      const numero = expiraHoje.r?.quarto?.numero || expiraHoje.r?.quarto_id
      list.push({ label: `Reserva do quarto ${numero} expira hoje`, status: "success" })
    }

    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const cancel = reservas
      .filter((r) => (r?.estado || "").toString().toLowerCase() === "cancelado")
      .map((r) => ({ r, when: toDate(r?.updated_at) || toDate(r?.created_at) }))
      .filter((x) => x.when && x.when >= since)
      .sort((a, b) => b.when - a.when)[0]

    if (cancel?.r) {
      const numero = cancel.r?.quarto?.numero || cancel.r?.quarto_id
      list.push({ label: `Cancelamento recente no quarto ${numero}`, status: "danger" })
    }

    return list
  }, [pagamentos, reservas, now])

  const kpis = useMemo(() => {
    return [
      { label: "Ocupação Atual", value: kpiValues.ocupacaoAtual === null ? "—" : `${kpiValues.ocupacaoAtual}%`, desc: "% de quartos ocupados" },
      { label: "Reservas Ativas", value: kpiValues.reservasAtivas === null ? "—" : String(kpiValues.reservasAtivas), desc: "número total de reservas" },
      { label: "Receita Total", value: kpiValues.receitaMesFmt ?? "—", desc: "total do mês" },
      { label: "Cancelamentos Recentes", value: kpiValues.cancelamentosRecentes === null ? "—" : String(kpiValues.cancelamentosRecentes), desc: "nº de cancelamentos nas últimas 24h" },
    ]
  }, [kpiValues])

  return (
    <AdminLayout title="DASHBOARD" subtitle="Resumo Geral">
      <div className="admin-grid cols-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {kpis.map((item) => (
          <div key={item.label} className="admin-card admin-kpi" style={{ minHeight: "120px" }}>
            <div className="label" style={{ fontWeight: 700, fontSize: "15px" }}>{item.label}</div>
            <div className="value">{loading ? "…" : item.value}</div>
            <div className="label" style={{ marginTop: "4px" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 style={{ margin: "8px 0 14px", color: "#1f2937", fontSize: "20px", fontWeight: 800 }}>Receitas</h2>
        <div className="admin-card" style={{ borderColor: "#d9e2ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Receitas Recentes</h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className={`admin-btn ${receitasPeriodo === "semana" ? "primary" : "secondary"}`}
                style={{ padding: "6px 12px", borderRadius: "6px" }}
                onClick={() => setReceitasPeriodo("semana")}
                type="button"
              >
                Semana
              </button>
              <button
                className={`admin-btn ${receitasPeriodo === "mes" ? "primary" : "secondary"}`}
                style={{ padding: "6px 12px", borderRadius: "6px" }}
                onClick={() => setReceitasPeriodo("mes")}
                type="button"
              >
                Mês
              </button>
              <button
                className={`admin-btn ${receitasPeriodo === "ano" ? "primary" : "secondary"}`}
                style={{ padding: "6px 12px", borderRadius: "6px" }}
                onClick={() => setReceitasPeriodo("ano")}
                type="button"
              >
                Ano
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "10px", color: "#6b7280" }}>A carregar...</div>
          ) : !hasReceipts ? (
            <div style={{ padding: "10px", color: "#6b7280" }}>Sem receitas para este período.</div>
          ) : (
            <>
              <div className="admin-chart-bars" style={{ height: "180px", alignItems: "flex-end" }}>
                {receiptBars.map((h, idx) => (
                  <div key={idx} className="bar" style={{ height: `${h}px` }} />
                ))}
              </div>
              <div className="admin-chart-legend" style={{ justifyContent: "space-between", fontSize: "12px" }}>
                {receiptsData.labels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ margin: "4px 0 14px", color: "#1f2937", fontSize: "20px", fontWeight: 800 }}>Alertas</h2>
        <div className="admin-card" style={{ borderColor: "#d9e2ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Alertas Recentes</h3>
          </div>

          {loading ? (
            <div style={{ padding: "10px", color: "#6b7280" }}>A carregar...</div>
          ) : alerts.length === 0 ? (
            <div style={{ padding: "10px", color: "#6b7280" }}>Sem alertas.</div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {alerts.map((row) => (
                <div key={row.label} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ flex: 1, background: "#f8fafc", borderRadius: "12px", padding: "6px 10px", fontSize: "13px" }}>
                    {row.label}
                  </div>
                  <div style={{ width: "90px", background: "#e5e7eb", borderRadius: "12px", overflow: "hidden", height: "14px" }}>
                    <div
                      style={{
                        width: row.status === "danger" ? "80%" : row.status === "success" ? "70%" : "60%",
                        height: "100%",
                        background: row.status === "danger" ? "#ef4444" : row.status === "success" ? "#22c55e" : "#f59e0b",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#f59e0b", borderRadius: "4px" }}></span>Aviso</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#22c55e", borderRadius: "4px" }}></span>Sucesso</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "4px" }}></span>Erro</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
