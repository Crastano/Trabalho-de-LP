"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import api from "../api/api"
import elegantHotelImg from "../assets/images/elegant-hotel.jpg"
import luxuryBedroomHotelImg from "../assets/images/luxury-bedroom-hotel.jpg"
import { resolveImageUrl } from "../utils/imageUrl"

export default function Reservations() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login")
      return
    }

    const fetchReservas = async () => {
      try {
        setLoading(true)
        const response = await api.get("/reservas")
        const data = Array.isArray(response.data) ? response.data : response.data.data || []
        setReservas(data)
      } catch (error) {
        console.error("Erro ao carregar reservas:", error)
        // Dados mock em caso de erro
        setReservas([
          {
            id: 1,
            quarto: { nome: "Quarto Padrão", imagem: elegantHotelImg },
            data_entrada: "2024-01-15",
            data_saida: "2024-01-18",
            status: "confirmada",
            preco_total: 420,
          },
          {
            id: 2,
            quarto: { nome: "Quarto Executivo", imagem: luxuryBedroomHotelImg },
            data_entrada: "2024-02-10",
            data_saida: "2024-02-12",
            status: "pendente",
            preco_total: 560,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchReservas()
    }
  }, [user, authLoading, navigate])

  const handleCancelReservation = async (reservaId) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) return

    try {
      await api.delete(`/reservas/${reservaId}`)
      setReservas((prev) => prev.filter((r) => r.id !== reservaId))
      alert("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error)
      alert("Erro ao cancelar reserva. Tente novamente.")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
        return "#22c55e"
      case "pendente":
        return "#f59e0b"
      case "cancelada":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "18px" }}>A carregar reservas...</p>
      </div>
    )
  }

  return (
    <div className="reservations-page">
      <style>{`
                .reservations-page {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                /* HERO BANNER */
                .reservations-hero {
                    background: #1e3a8a;
                    color: white;
                    text-align: center;
                    padding: 60px 20px 40px;
                }

                .reservations-hero h1 {
                    font-size: 42px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }

                .reservations-hero-breadcrumb {
                    font-size: 14px;
                    opacity: 0.8;
                }

                .reservations-hero-breadcrumb a {
                    color: white;
                    text-decoration: none;
                }

                .reservations-hero-breadcrumb span {
                    margin: 0 8px;
                }

                /* CONTEÚDO */
                .reservations-content {
                    padding: 60px 80px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .reservations-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .reservations-header h2 {
                    font-size: 28px;
                    font-weight: 600;
                    margin: 0;
                    color: #111;
                }

                .new-reservation-btn {
                    background: #f59e0b;
                    color: #111;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.3s;
                }

                .new-reservation-btn:hover {
                    background: #d97706;
                }

                /* LISTA DE RESERVAS */
                .reservations-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .reservation-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    display: flex;
                    transition: transform 0.3s;
                }

                .reservation-card:hover {
                    transform: translateY(-2px);
                }

                .reservation-image {
                    width: 200px;
                    height: 150px;
                    background-size: cover;
                    background-position: center;
                    flex-shrink: 0;
                }

                .reservation-info {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .reservation-details h3 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: #111;
                }

                .reservation-dates {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }

                .reservation-status {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                }

                .reservation-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 12px;
                }

                .reservation-price {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e3a8a;
                }

                .cancel-btn {
                    background: none;
                    border: 1px solid #ef4444;
                    color: #ef4444;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s;
                }

                .cancel-btn:hover {
                    background: #ef4444;
                    color: white;
                }

                /* ESTADO VAZIO */
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: #f9fafb;
                    border-radius: 12px;
                }

                .empty-state h3 {
                    font-size: 24px;
                    color: #374151;
                    margin: 0 0 12px 0;
                }

                .empty-state p {
                    font-size: 16px;
                    color: #6b7280;
                    margin: 0 0 24px 0;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .reservations-content {
                        padding: 40px 24px;
                    }

                    .reservations-header {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .reservation-card {
                        flex-direction: column;
                    }

                    .reservation-image {
                        width: 100%;
                        height: 180px;
                    }

                    .reservation-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }

                    .reservation-actions {
                        align-items: flex-start;
                        width: 100%;
                    }

                    .reservations-hero h1 {
                        font-size: 32px;
                    }
                }
            `}</style>

      {/* HERO BANNER */}
      <div className="reservations-hero">
        <h1>Minhas Reservas</h1>
        <div className="reservations-hero-breadcrumb">
          <Link to="/">HOME</Link>
          <span>|</span>
          <span>RESERVATIONS</span>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="reservations-content">
        <div className="reservations-header">
          <h2>Histórico de Reservas</h2>
          <Link to="/rooms" className="new-reservation-btn">
            + Nova Reserva
          </Link>
        </div>

        {reservas.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma reserva encontrada</h3>
            <p>Você ainda não fez nenhuma reserva. Explore nossos quartos e faça sua primeira reserva!</p>
            <Link to="/rooms" className="new-reservation-btn">
              Ver Quartos Disponíveis
            </Link>
          </div>
        ) : (
          <div className="reservations-list">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reservation-card">
                <div
                  className="reservation-image"
                  style={{
                    backgroundImage: `url('${resolveImageUrl(reserva.quarto?.imagem, "https://via.placeholder.com/200x150?text=Quarto")}')`,
                  }}
                />
                <div className="reservation-info">
                  <div className="reservation-details">
                    <h3>{reserva.quarto?.nome || "Quarto"}</h3>
                    <div className="reservation-dates">
                      {formatDate(reserva.data_entrada)} - {formatDate(reserva.data_saida)}
                    </div>
                    <div className="reservation-status" style={{ backgroundColor: getStatusColor(reserva.status) }}>
                      {reserva.status || "Pendente"}
                    </div>
                  </div>
                  <div className="reservation-actions">
                    <div className="reservation-price">{reserva.preco_total}€</div>
                    {reserva.status?.toLowerCase() !== "cancelada" && (
                      <button className="cancel-btn" onClick={() => handleCancelReservation(reserva.id)}>
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
