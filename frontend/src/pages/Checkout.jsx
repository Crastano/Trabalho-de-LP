import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import api from "../api/api"
import { useAuth } from "../context/AuthContext"
import { resolveImageUrl } from "../utils/imageUrl"

const parseDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const formatDate = (dateString) => {
  const date = parseDate(dateString)
  if (!date) return "—"
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const getNights = (inicio, fim) => {
  const start = parseDate(inicio)
  const end = parseDate(fim)
  if (!start || !end) return null
  const dayMs = 1000 * 60 * 60 * 24
  const diff = Math.round((end.getTime() - start.getTime()) / dayMs)
  if (!Number.isFinite(diff) || diff <= 0) return null
  return diff
}

const formatPrice = (value) => {
  if (value == null) return "—"
  const number = typeof value === "string" ? Number(value) : value
  if (typeof number !== "number" || !Number.isFinite(number)) return "—"
  return `${number.toFixed(2)}€`
}

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [reserva, setReserva] = useState(null)
  const [form, setForm] = useState({
    telefone: "",
    cartao_numero: "",
    cartao_validade: "",
    cartao_cvc: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login")
      return
    }

    const fetchReserva = async () => {
      try {
        setLoading(true)
        const resp = await api.get(`/reservas/${id}`)
        setReserva(resp?.data ?? null)
      } catch (err) {
        console.error("Erro ao carregar reserva", err)
        setReserva(null)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchReserva()
  }, [id, user, authLoading, navigate])

  const pagamento = reserva?.pagamento
  const metodo = (pagamento?.metodo || "").toLowerCase()
  const pagamentoEstado = (pagamento?.estado || "").toLowerCase()

  const total = useMemo(() => {
    if (pagamento && typeof pagamento.valor === "number" && Number.isFinite(pagamento.valor)) return pagamento.valor

    const nights = getNights(reserva?.data_inicio, reserva?.data_fim)
    const precoDia = reserva?.quarto?.preco_por_dia
    if (typeof precoDia === "number" && Number.isFinite(precoDia) && nights) return precoDia * nights

    if (typeof precoDia === "string" && precoDia.trim() !== "" && nights) {
      const parsed = Number(precoDia)
      if (Number.isFinite(parsed)) return parsed * nights
    }

    return null
  }, [pagamento, reserva?.data_inicio, reserva?.data_fim, reserva?.quarto?.preco_por_dia])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const confirmarPagamento = async () => {
    if (!reserva?.id) return

    if (metodo === "mbway") {
      const tel = (form.telefone || "").trim()
      if (!tel) {
        alert("Indique o número de telemóvel para MB WAY.")
        return
      }
    }

    if (metodo === "cartao") {
      const n = (form.cartao_numero || "").replace(/\s/g, "")
      if (!n || n.length < 12) {
        alert("Indique um número de cartão válido.")
        return
      }
      if (!(form.cartao_validade || "").trim()) {
        alert("Indique a validade do cartão (MM/AA).")
        return
      }
      if (!((form.cartao_cvc || "").trim().length >= 3)) {
        alert("Indique o CVC.")
        return
      }
    }

    try {
      setSubmitting(true)
      await api.post(`/reservas/${reserva.id}/pagar`, {
        metodo: pagamento?.metodo,
        telefone: metodo === "mbway" ? (form.telefone || "").trim() : undefined,
        cartao_numero: metodo === "cartao" ? (form.cartao_numero || "").trim() : undefined,
        cartao_validade: metodo === "cartao" ? (form.cartao_validade || "").trim() : undefined,
        cartao_cvc: metodo === "cartao" ? (form.cartao_cvc || "").trim() : undefined,
      })

      alert("Pagamento confirmado com sucesso!")
      navigate("/reservations")
    } catch (err) {
      console.error("Erro ao confirmar pagamento", err)
      const msg = err?.response?.data?.message || "Erro ao confirmar pagamento."
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const baixarFatura = async () => {
    if (!reserva?.id) return
    try {
      setDownloading(true)
      const resp = await api.get(`/reservas/${reserva.id}/fatura`, { responseType: "blob" })
      const blob = new Blob([resp.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const pagamentoId = reserva?.pagamento?.id || reserva.id
      a.download = `fatura_pagamento_${pagamentoId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Erro ao baixar fatura", err)
      const msg = err?.response?.data?.message || "Erro ao gerar a fatura em PDF."
      alert(msg)
    } finally {
      setDownloading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontSize: 18 }}>A carregar checkout...</p>
      </div>
    )
  }

  if (!reserva) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <h2>Reserva não encontrada</h2>
        <Link to="/reservations" style={{ color: "#1e3a8a" }}>
          Voltar às reservas
        </Link>
      </div>
    )
  }

  const isPaid = pagamentoEstado === "pago"
  const isPending = pagamentoEstado === "pendente"

  return (
    <div className="checkout-page">
      <style>{`
        .checkout-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .checkout-hero {
          background: #010101ff;
          background-image: linear-gradient(rgba(0,0,0,.60), rgba(0,0,0,.78)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=70');
          background-size: cover;
          background-position: center;
          color: #fff;
          text-align: center;
          height: 260px;
          padding: 60px 20px 40px;
        }
        .checkout-hero h1 { font-size: 40px; font-weight: 700; margin: 0 0 8px; }
        .checkout-hero-breadcrumb { font-size: 14px; opacity: .85; }
        .checkout-hero-breadcrumb a { color: #fff; text-decoration: none; }
        .checkout-hero-breadcrumb span { margin: 0 8px; }

        .checkout-content { padding: 50px 24px; max-width: 1100px; margin: 0 auto; }
        .checkout-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 10px 26px rgba(0,0,0,.10);
          overflow: hidden;
          display: grid;
          grid-template-columns: 320px 1fr;
        }
        .checkout-image {
          min-height: 260px;
          background-size: cover;
          background-position: center;
        }
        .checkout-body { padding: 22px 22px 24px; }
        .checkout-title { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
        .checkout-title h2 { margin: 0; font-size: 22px; color: #111; }
        .checkout-total { font-weight: 800; color: #1e3a8a; font-size: 22px; }
        .checkout-meta { margin-top: 8px; color: #6b7280; font-size: 14px; }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          margin-top: 10px;
        }
        .pill.pending { background: rgba(245,158,11,.14); color: #a16207; }
        .pill.paid { background: rgba(34,197,94,.14); color: #15803d; }

        .form { margin-top: 18px; display: grid; gap: 12px; }
        .field label { display: block; font-size: 12px; color: #374151; margin-bottom: 6px; font-weight: 700; }
        .field input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
        }
        .field input:focus { border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,.18); }

        .actions { margin-top: 18px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .btn {
          border: none;
          border-radius: 10px;
          padding: 11px 14px;
          font-weight: 800;
          cursor: pointer;
          font-size: 14px;
        }
        .btn.primary { background: #f59e0b; color: #111; }
        .btn.primary:hover { background: #d97706; }
        .btn.secondary { background: #f3f4f6; color: #111; }
        .btn.secondary:hover { background: #e5e7eb; }
        .btn:disabled { opacity: .6; cursor: not-allowed; }

        @media (max-width: 900px) {
          .checkout-card { grid-template-columns: 1fr; }
          .checkout-image { min-height: 180px; }
        }
      `}</style>

      <div className="checkout-hero">
        <h1>Pagamento</h1>
        <div className="checkout-hero-breadcrumb">
          <Link to="/">HOME</Link>
          <span>|</span>
          <Link to="/reservations">RESERVATIONS</Link>
          <span>|</span>
          <span>CHECKOUT</span>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-card">
          <div
            className="checkout-image"
            style={{
              backgroundImage: `url('${resolveImageUrl(reserva.quarto?.imagem, "https://via.placeholder.com/600x400?text=Quarto")}' )`,
            }}
          />

          <div className="checkout-body">
            <div className="checkout-title">
              <h2>{reserva.quarto?.nome || "Reserva"}</h2>
              <div className="checkout-total">{formatPrice(total)}</div>
            </div>

            <div className="checkout-meta">
              {formatDate(reserva.data_inicio)} — {formatDate(reserva.data_fim)}
              {typeof getNights(reserva.data_inicio, reserva.data_fim) === "number" ? ` • ${getNights(reserva.data_inicio, reserva.data_fim)} noite(s)` : ""}
              {pagamento?.metodo ? ` • Método: ${pagamento.metodo}` : ""}
            </div>

            {pagamento ? (
              <div className={`pill ${isPaid ? "paid" : "pending"}`}>Pagamento: {isPaid ? "Pago" : isPending ? "Pendente" : pagamentoEstado || "—"}</div>
            ) : (
              <div className="pill pending">Sem pagamento associado</div>
            )}

            {!pagamento ? (
              <div style={{ marginTop: 14, color: "#6b7280" }}>Esta reserva foi criada sem método de pagamento.</div>
            ) : isPaid ? (
              <div style={{ marginTop: 14, color: "#15803d", fontWeight: 700 }}>Pagamento já confirmado.</div>
            ) : (
              <>
                {metodo === "mbway" && (
                  <div className="form">
                    <div className="field">
                      <label>Número MB WAY</label>
                      <input name="telefone" value={form.telefone} onChange={onChange} placeholder="Ex: 912345678" />
                    </div>
                  </div>
                )}

                {metodo === "cartao" && (
                  <div className="form">
                    <div className="field">
                      <label>Número do cartão</label>
                      <input name="cartao_numero" value={form.cartao_numero} onChange={onChange} placeholder="0000 0000 0000 0000" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="field">
                        <label>Validade</label>
                        <input name="cartao_validade" value={form.cartao_validade} onChange={onChange} placeholder="MM/AA" />
                      </div>
                      <div className="field">
                        <label>CVC</label>
                        <input name="cartao_cvc" value={form.cartao_cvc} onChange={onChange} placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {metodo !== "mbway" && metodo !== "cartao" && (
                  <div style={{ marginTop: 14, color: "#6b7280" }}>Método de pagamento: {pagamento.metodo}. Clique em confirmar.</div>
                )}

                <div className="actions">
                  <button className="btn primary" onClick={confirmarPagamento} disabled={submitting}>
                    {submitting ? "A processar..." : "Confirmar pagamento"}
                  </button>
                  <button className="btn secondary" onClick={() => navigate("/reservations")} disabled={submitting}>
                    Voltar às reservas
                  </button>
                </div>
              </>
            )}

            {(isPaid || !pagamento) && (
              <div className="actions">
                {isPaid && (
                  <button className="btn primary" onClick={baixarFatura} disabled={downloading}>
                    {downloading ? "A gerar PDF..." : "Baixar fatura"}
                  </button>
                )}
                <button className="btn secondary" onClick={() => navigate("/reservations")}>Voltar às reservas</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
