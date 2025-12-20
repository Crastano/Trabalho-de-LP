"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../api/api";
  
export default function Rooms() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const quartosPerPage = 9;

  const withDisponibilidade = (q) => {
    const estado = (q?.estado ?? "").toLowerCase();
    const disponivel = q?.disponivel ?? (estado ? estado !== "ocupado" : true);
    return { ...q, disponivel };
  };

  useEffect(() => {
    const fetchQuartos = async () => {
      try {
        setLoading(true);
        const response = await api.get("/quartos");
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setQuartos(data.map(withDisponibilidade));
      } catch (error) {
        console.error("Erro ao carregar quartos:", error);
        setQuartos([
          {
            id: 1,
            nome: "Quarto Padrao",
            preco_por_dia: 140,
            tipo: "Padrao",
            imagem: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
            capacidade: 1,
            camas: "1 single bed, 1 sofa bed",
            wifi: true,
            disponivel: true,
          },
          {
            id: 2,
            nome: "Quarto Executivo",
            preco_por_dia: 280,
            tipo: "Executivo",
            imagem: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
            capacidade: 2,
            camas: "1 king bed, 1 sofa bed",
            wifi: true,
            disponivel: true,
          },
          {
            id: 3,
            nome: "Quarto de Luxo",
            preco_por_dia: 400,
            tipo: "Luxo",
            imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
            capacidade: 3,
            camas: "1 king bed",
            wifi: true,
            disponivel: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuartos();
  }, []);

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value || 0);

  const quartosFiltrados =
    filtroTipo === "todos" ? quartos : quartos.filter((q) => q.tipo?.toLowerCase() === filtroTipo.toLowerCase());

  const indexOfLastQuarto = currentPage * quartosPerPage;
  const indexOfFirstQuarto = indexOfLastQuarto - quartosPerPage;
  const quartosAtuais = quartosFiltrados.slice(indexOfFirstQuarto, indexOfLastQuarto);
  const totalPages = Math.max(1, Math.ceil(quartosFiltrados.length / quartosPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "18px" }}>A carregar quartos...</p>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <style>{`
        .rooms-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .rooms-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('./src/assets/images/interior-modern.jpg');
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

        .rooms-hero h1 {
          font-size: 62px;
          font-weight: 700;
          margin: 0;
        }

        .rooms-hero-breadcrumb {
          font-size: 14px;
          letter-spacing: 1px;
        }

        .rooms-hero-breadcrumb a {
          color: white;
          text-decoration: none;
        }

        .rooms-hero-breadcrumb span {
          margin: 0 8px;
        }

        .rooms-filters {
          text-align: center;
          padding: 50px 20px 30px;
          background: white;
        }

        .rooms-filters h2 {
          font-size: 32px;
          margin: 0 0 30px 0;
          color: #1e3a8a;
          font-weight: 600;
        }

        .rooms-filters h2 span {
          color: #ca8a04;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 12px 28px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s;
          color: #374151;
        }

        .filter-btn:hover {
          border-color: #1e3a8a;
          color: #1e3a8a;
        }

        .filter-btn.active {
          background: #1e3a8a;
          color: white;
          border-color: #1e3a8a;
        }

        .rooms-section {
          padding: 20px 60px 80px;
          background: white;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .room-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          min-height: 520px;
        }

        .room-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 55px rgba(15, 23, 42, 0.18);
        }

        .room-card-image {
          position: relative;
          height: 260px;
          background-size: cover;
          background-position: center;
        }

        .room-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #1e3a8a;
          color: white;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .room-badge.indisponivel {
          background: #dc2626;
        }

        .room-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px;
          gap: 18px;
        }

        .room-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .room-type {
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .room-card-header h3 {
          font-size: 22px;
          font-weight: 600;
          margin: 4px 0 0;
          color: #0f172a;
        }

        .room-card-price {
          text-align: right;
        }

        .room-card-price .price {
          font-size: 28px;
          font-weight: 700;
          color: #f59e0b;
          line-height: 1;
        }

        .room-card-price .period {
          font-size: 12px;
          color: #94a3b8;
        }

        .room-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .room-feature {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 13px;
          color: #475569;
        }

        .room-feature .icon {
          font-size: 15px;
        }

        .room-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
        }

        .room-card-btn {
          background: #f59e0b;
          color: #111;
          padding: 14px 28px;
          border-radius: 28px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-decoration: none;
          transition: background 0.3s ease;
        }

        .room-card-btn:hover {
          background: #d97706;
        }

        .room-card-btn.disabled {
          background: #d1d5db;
          cursor: not-allowed;
          pointer-events: none;
        }

        .rooms-empty {
          text-align: center;
          font-size: 16px;
          color: #6b7280;
          margin-top: 24px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 50px;
          gap: 16px;
        }

        .pagination-btn {
          padding: 14px 32px;
          background: white;
          color: #1e3a8a;
          border: 2px solid #1e3a8a;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #1e3a8a;
          color: white;
        }

        .pagination-btn:disabled {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .rooms-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .rooms-section {
            padding: 20px 40px 60px;
          }
        }

        @media (max-width: 768px) {
          .rooms-grid {
            grid-template-columns: 1fr;
          }
          .rooms-section {
            padding: 20px 24px 60px;
          }
          .rooms-hero h1 {
            font-size: 40px;
          }
        }
      `}</style>

      <div className="rooms-hero">
        <h1>Quartos</h1>
        <div className="rooms-hero-breadcrumb">
          <Link to="/">HOME</Link>
        </div>
      </div>

      <div className="rooms-filters">
        <h2>
          Quartos de <span>Luxo</span> e <span>Suite</span>
        </h2>
        <div className="filter-buttons">
          {[
            { label: "Todos", value: "todos" },
            { label: "Padrao", value: "padrao" },
            { label: "Executivo", value: "executivo" },
            { label: "Luxo", value: "luxo" },
          ].map((filtro) => (
            <button
              key={filtro.value}
              className={`filter-btn ${filtroTipo === filtro.value ? "active" : ""}`}
              onClick={() => {
                setFiltroTipo(filtro.value);
                setCurrentPage(1);
              }}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rooms-section">
        {quartosAtuais.length === 0 ? (
          <p className="rooms-empty">Nenhum quarto encontrado para este filtro.</p>
        ) : (
          <div className="rooms-grid">
            {quartosAtuais.map((quarto) => (
              <div key={quarto.id} className="room-card">
                <div
                  className="room-card-image"
                  style={{
                    backgroundImage: `url(${quarto.imagem || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80"})`,
                  }}
                >
                  <span className={`room-badge ${quarto.disponivel === false ? "indisponivel" : ""}`}>
                    {quarto.disponivel === false ? "Indisponivel" : "Disponivel"}
                  </span>
                </div>
                <div className="room-card-content">
                  <div className="room-card-header">
                    <div>
                      <div className="room-type">{quarto.tipo || "Luxo"}</div>
                      <h3>{quarto.nome || `Quarto ${quarto.tipo || "Luxo"}`} #{quarto.numero || quarto.id}</h3>
                    </div>
                    <div className="room-card-price">
                      <div className="price">{formatCurrency(quarto.preco_por_dia)}</div>
                      <div className="period">por noite</div>
                    </div>
                  </div>

                  <div className="room-card-features">
                    <div className="room-feature">
                      <span className="icon" role="img" aria-label="cama">
                        🛏️
                      </span>
                      {quarto.camas || "1 cama de casal"}
                    </div>
                    <div className="room-feature">
                      <span className="icon" role="img" aria-label="pessoas">
                        👥
                      </span>
                      {quarto.capacidade || 2} adultos
                    </div>
                    <div className="room-feature">
                      <span className="icon" role="img" aria-label="wifi">
                        📶
                      </span>
                      {quarto.wifi === false ? "Sem Wi-Fi" : "Free Wi-Fi"}
                    </div>
                  </div>

                  <div className="room-card-footer">
                    <Link
                      to={`/rooms/${quarto.id}`}
                      state={{ quarto }}
                      className={`room-card-btn ${quarto.disponivel === false ? "disabled" : ""}`}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {quartosFiltrados.length > quartosPerPage && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              ← Previous
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next Page →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
