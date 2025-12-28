"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router"
import { useAuth } from "../context/AuthContext"
import api from "../api/api"
import elegantHotelImg from "../assets/images/elegant-hotel.jpg"
import { resolveImageUrl } from "../utils/imageUrl"

export default function RoomDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const stateQuarto = location.state?.quarto
  const initialQuarto = stateQuarto && `${stateQuarto.id}` === `${id}` ? stateQuarto : null

  const hasPreco = (q) =>
    q &&
    (q.preco_por_dia ?? q.precoPorDia ?? q.preco_por_noite ?? q.precoPorNoite ?? q.preco) != null

  const [quarto, setQuarto] = useState(initialQuarto)
  const [loading, setLoading] = useState(!initialQuarto || !hasPreco(initialQuarto))
  const [bookingData, setBookingData] = useState({
    nome: user?.name || "",
    telefone: user?.telefone || "",
    checkIn: "",
    checkOut: "",
    metodo_pagamento: "mbway",
  })
  const [submitting, setSubmitting] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [mapRooms, setMapRooms] = useState([])
  const [mapLoading, setMapLoading] = useState(true)
  const [selectionMessage, setSelectionMessage] = useState("")

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value || 0)

  const precoDia =
    quarto?.preco_por_dia ??
    quarto?.precoPorDia ??
    quarto?.preco_por_noite ??
    quarto?.precoPorNoite ??
    quarto?.preco ??
    null

  useEffect(() => {
    const fetchQuarto = async () => {
      try {
        setLoading(!initialQuarto || !hasPreco(initialQuarto))
        const response = await api.get(`/quartos/${id}`)
        const payload = response?.data?.data ?? response?.data

        // Evita substituir dados válidos (vindos da lista/state) por payloads incompletos
        // (ex.: quando o backend devolve apenas parte dos campos).
        setQuarto((prev) => {
          const next = payload && typeof payload === "object" ? payload : null
          if (!next) return prev ?? next

          if (!prev) return next

          return {
            ...prev,
            ...Object.fromEntries(Object.entries(next).filter(([, v]) => v !== null && v !== undefined)),
          }
        })
      } catch (error) {
        console.error("Erro ao carregar quarto:", error)
        // Dados mock em caso de erro
        setQuarto({
          id: Number.parseInt(id),
          nome: "Quarto Padrão",
          preco_por_dia: 140,
          tipo: "Padrão",
          imagem: elegantHotelImg,
          capacidade: 2,
          camas: "1 single bed, 1 sofa bed",
          wifi: true,
          ar_condicionado: true,
          tv: true,
          descricao:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchQuarto()
  }, [id])

  // Carrega mapa de disponibilidade por tipo (polling leve para manter "tempo real")
  useEffect(() => {
    let intervalId

    // reset seleção ao trocar de tipo de quarto
    setSelectedRoom(null)
    setSelectionMessage("")

    const buildGrid = (rooms = []) => {
      const cols = 6
      const rows = []
      const list = rooms.map((r) => ({
        id: r.id,
        numero: r.numero || r.id,
        nome: r.nome,
        disponivel: (r.estado || "").toLowerCase() !== "ocupado",
        tipo: r.tipo || tipoAtual || "",
      }))
      for (let i = 0; i < list.length; i += cols) {
        rows.push(list.slice(i, i + cols))
      }
      return rows
    }

    const fetchMap = async (tipoAtual) => {
      try {
        setMapLoading(true)
        const resp = await api.get("/quartos")
        const data = Array.isArray(resp.data) ? resp.data : resp.data?.data || []
        const filtrados = tipoAtual ? data.filter((q) => (q.tipo || "").toLowerCase() === tipoAtual.toLowerCase()) : data
        const matriz = filtrados.length ? buildGrid(filtrados) : buildGrid([
          { id: 1, numero: 101, nome: "Quarto", disponivel: true, tipo: "Padrão" },
          { id: 2, numero: 102, nome: "Quarto", disponivel: false, tipo: "Padrão" },
        ])
        setMapRooms(matriz)
      } catch (err) {
        console.error("Erro ao carregar mapa de quartos:", err)
      } finally {
        setMapLoading(false)
      }
    }

    // primeira carga
    fetchMap(quarto?.tipo)

    // polling a cada 30s para refletir atualizações da área admin
    intervalId = setInterval(() => fetchMap(quarto?.tipo), 30000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [quarto?.tipo])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    try {
      setSubmitting(true)

      const quartoId = selectedRoom?.id ?? quarto.id

      // Atualiza telefone do utilizador (se necessário)
      const tel = (bookingData.telefone || "").trim()
      if (tel && tel !== (user?.telefone || "")) {
        try {
          await api.put("/user", { telefone: tel })
        } catch {
          // não bloqueia a reserva; apenas melhora dados de contacto
        }
      }

      await api.post("/reservas", {
        quarto_id: quartoId,
        data_entrada: bookingData.checkIn,
        data_saida: bookingData.checkOut,
        metodo_pagamento: bookingData.metodo_pagamento,
      })
      alert("Reserva criada com sucesso!")
      navigate("/reservations")
    } catch (error) {
      console.error("Erro ao criar reserva:", error)
      const msg =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat()?.[0]
          : null) ||
        "Erro ao criar reserva. Tente novamente."
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoomSelect = (row, col) => {
    const room = mapRooms[row]?.[col]
    if (room && room.disponivel) {
      const tipoLabel = (room.tipo || quarto?.tipo || "").toLowerCase()
      const tipoTexto =
        tipoLabel === "padrão" || tipoLabel === "padrao"
          ? "Quarto padrão"
          : tipoLabel === "executivo"
          ? "Quarto executivo"
          : tipoLabel === "luxo"
          ? "Quarto luxo"
          : "Quarto"

      setSelectedRoom({ row, col, numero: room.numero, id: room.id, tipo: room.tipo })
      setSelectionMessage(`${tipoTexto} selecionado: nº ${room.numero}`)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "18px" }}>A carregar detalhes do quarto...</p>
      </div>
    )
  }

  if (!quarto) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Quarto não encontrado</h2>
        <Link to="/rooms" style={{ color: "#1e3a8a" }}>
          Voltar aos quartos
        </Link>
      </div>
    )
  }

  return (
    <div className="room-details-page">
      <style>{`
                .room-details-page {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                /* HERO BANNER */
                .details-hero {
                  background-size: cover;
                  background-position: center;
                  height: 350px;
                  color: white;
                  text-align: center;
                  padding: 80px 20px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 12px;
                }

                .details-hero h1 {
                    font-size: 42px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }

                .details-hero-breadcrumb {
                    font-size: 14px;
                    opacity: 0.8;
                }

                .details-hero-breadcrumb a {
                    color: white;
                    text-decoration: none;
                }

                .details-hero-breadcrumb span {
                    margin: 0 8px;
                }

                /* CONTEÚDO PRINCIPAL */
                .details-content {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 40px;
                    padding: 60px 80px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                /* LADO ESQUERDO - INFO DO QUARTO */
                .room-info {
                    
                }

                .room-main-image {
                    width: 100%;
                    height: 350px;
                    border-radius: 12px;
                    object-fit: cover;
                    margin-bottom: 24px;
                }

                .room-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    color: #111;
                }

                .room-price {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e3a8a;
                    margin-bottom: 20px;
                }

                .room-description {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                    margin-bottom: 32px;
                }

                /* CARACTERÍSTICAS */
                .characteristics-title {
                    font-size: 22px;
                    font-weight: 600;
                    margin: 0 0 20px 0;
                    color: #111;
                }

                .characteristics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .characteristic-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: #4b5563;
                }

                .characteristic-item svg {
                    width: 22px;
                    height: 22px;
                    color: #6b7280;
                }

                /* MAPA INTERATIVO */
                .map-section {
                    margin-top: 40px;
                }

                .map-title {
                    font-size: 22px;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                    color: #111;
                }

                .map-subtitle {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 20px;
                }

                .availability-map {
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                }

                .map-grid {
                    display: grid;
                  grid-template-columns: repeat(6, 48px);
                    gap: 6px;
                }

                .map-cell {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                  color: #0f172a;
                  font-weight: 600;
                }

                .map-cell.available {
                    background: #22c55e;
                }

                .map-cell.available:hover {
                    background: #16a34a;
                    transform: scale(1.1);
                }

                .map-cell.unavailable {
                    background: #ef4444;
                    cursor: not-allowed;
                }

                .map-cell.selected {
                    border-color: #1e3a8a;
                    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.3);
                }

                .map-legend {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .map-selection-info {
                  margin-top: 8px;
                  font-size: 13px;
                  color: #0f172a;
                  background: #e0e7ff;
                  border: 1px solid #c7d2fe;
                  padding: 10px 12px;
                  border-radius: 8px;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #4b5563;
                }

                .legend-color {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                }

                .legend-color.green { background: #22c55e; }
                .legend-color.red { background: #ef4444; }
                .legend-color.blue { background: #1e3a8a; }

                /* LADO DIREITO - FORMULÁRIO DE RESERVA */
                .booking-card {
                    background: white;
                    border-radius: 12px;
                    padding: 28px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                }

                .booking-card h3 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0 0 24px 0;
                    color: #111;
                }

                .booking-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }

                .form-group input {
                    padding: 12px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #1e3a8a;
                }

                .date-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .booking-btn {
                    width: 100%;
                    background: #1e3a8a;
                    color: white;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 16px;
                    margin-top: 8px;
                    transition: all 0.3s;
                }

                .booking-btn:hover {
                    background: #1e40af;
                }

                .booking-btn:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .details-content {
                        grid-template-columns: 1fr;
                        padding: 40px;
                    }

                    .booking-card {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .details-content {
                        padding: 24px;
                    }

                    .details-hero h1 {
                        font-size: 32px;
                    }

                    .characteristics-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .map-grid {
                      grid-template-columns: repeat(5, 44px);
                    }

                    .map-cell {
                        width: 44px;
                        height: 44px;
                    }
                }
            `}</style>

      {(() => {
        const heroUrl = resolveImageUrl(quarto?.imagem, elegantHotelImg)
        return (
          <>
            {/* HERO BANNER */}
            <div
              className="details-hero"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${heroUrl}')`,
              }}
            >
              <h1>{quarto?.nome || "Detalhes do Quarto"}</h1>
              <div className="details-hero-breadcrumb">
                <Link to="/">HOME</Link>
                <span>|</span>
                <Link to="/rooms">ROOMS</Link>
              </div>
            </div>
          </>
        )
      })()}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="details-content">
        {/* LADO ESQUERDO - INFO DO QUARTO */}
        <div className="room-info">
          <img
            src={resolveImageUrl(quarto.imagem, elegantHotelImg)}
            alt={quarto.nome}
            className="room-main-image"
          />

          <h2 className="room-title">{quarto.nome}</h2>
          <div className="room-price">{precoDia == null ? "A carregar preço..." : formatCurrency(Number(precoDia))}</div>

          <p className="room-description">
            {quarto.descricao ||
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
          </p>

          {/* CARACTERÍSTICAS */}
          <h3 className="characteristics-title">Características</h3>
          <div className="characteristics-grid">
            <div className="characteristic-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span>{quarto.camas || "1 single bed, 1 sofa bed"}</span>
            </div>
            <div className="characteristic-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span>{quarto.capacidade || 2} adultos</span>
            </div>
            {quarto.wifi !== false && (
              <div className="characteristic-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                  />
                </svg>
                <span>Free-Wifi</span>
              </div>
            )}
            {quarto.ar_condicionado !== false && (
              <div className="characteristic-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
                <span>Ar condicionado</span>
              </div>
            )}
            {quarto.tv !== false && (
              <div className="characteristic-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
                <span>TV</span>
              </div>
            )}
          </div>

          {/* MAPA INTERATIVO */}
          <div className="map-section">
            <h3 className="map-title">Mapa Interativo</h3>
              <p className="map-subtitle">Disponibilidade em tempo real dos quartos {quarto.tipo || ""}.</p>

            <div className="availability-map">
                <div className="map-grid">
                  {mapRooms.map((row, rowIndex) =>
                    row.map((room, colIndex) => {
                      const isSelected = selectedRoom?.row === rowIndex && selectedRoom?.col === colIndex
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`map-cell ${room?.disponivel ? "available" : "unavailable"} ${isSelected ? "selected" : ""}`}
                          onClick={() => handleRoomSelect(rowIndex, colIndex)}
                          title={room ? `Quarto ${room.numero} - ${room.disponivel ? "Disponível" : "Ocupado"}` : "Sem dados"}
                        >
                          {room?.numero || "-"}
                        </div>
                      )
                    }),
                  )}
                  {mapLoading && <div style={{ gridColumn: "1 / -1", color: "#6b7280", fontSize: "13px" }}>A atualizar mapa...</div>}
                </div>

              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color green"></div>
                  <span>Disponível</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color red"></div>
                  <span>Indisponível</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color blue"></div>
                  <span>Selecionado</span>
                </div>
              </div>
              {selectionMessage ? <div className="map-selection-info">{selectionMessage}</div> : null}
            </div>
          </div>
        </div>

        {/* LADO DIREITO - FORMULÁRIO DE RESERVA */}
        <div className="booking-card">
          <h3>Reserve o Quarto</h3>
          <form className="booking-form" onSubmit={handleBooking}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={bookingData.nome}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={bookingData.telefone}
                onChange={handleInputChange}
                placeholder="Ex: 912 000 000"
              />
            </div>

            <div className="date-row">
              <div className="form-group">
                <label>Check-in</label>
                <input type="date" name="checkIn" value={bookingData.checkIn} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Check-out</label>
                <input type="date" name="checkOut" value={bookingData.checkOut} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Método de pagamento</label>
              <select name="metodo_pagamento" value={bookingData.metodo_pagamento} onChange={handleInputChange} required>
                <option value="mbway">MB WAY</option>
                <option value="cartao">Cartão</option>
              </select>
            </div>

            <button type="submit" className="booking-btn" disabled={submitting}>
              {submitting ? "A processar..." : "BOOK NOW"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
