import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import heroImage from "../assets/images/main.jpg";
import heroCardImage from "../assets/images/interior-modern.jpg";
import elegantHotelImg from "../assets/images/elegant-hotel.jpg";
import luxuryBedroomHotelImg from "../assets/images/luxury-bedroom-hotel.jpg";
import luxuryBedroomImg from "../assets/images/luxury-bedroom.jpg";
import swimmingPoolImg from "../assets/images/swimming-pool.jpg";
import { resolveImageUrl } from "../utils/imageUrl";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [quartos, setQuartos] = useState([]);
  const [quartosLoading, setQuartosLoading] = useState(true);

  const destaqueMock = [
    {
      id: 1,
      numero: 101,
      nome: "Quarto Padrao",
      preco_por_dia: 140,
      tipo: "Padrao",
      imagem: elegantHotelImg,
      capacidade: 2,
      disponivel: true,
    },
    {
      id: 2,
      numero: 201,
      nome: "Quarto Executivo",
      preco_por_dia: 280,
      tipo: "Executivo",
      imagem: luxuryBedroomHotelImg,
      capacidade: 2,
      disponivel: true,
    },
    {
      id: 3,
      numero: 301,
      nome: "Quarto de Luxo",
      preco_por_dia: 400,
      tipo: "Luxo",
      imagem: luxuryBedroomImg,
      capacidade: 2,
      disponivel: true,
    },
  ];

  const withDisponibilidade = (q) => {
    const estado = (q?.estado ?? "").toLowerCase();
    const disponivel = q?.disponivel ?? (estado ? estado !== "ocupado" : true);
    return { ...q, disponivel };
  };

  useEffect(() => {
    const fetchQuartos = async () => {
      try {
        setQuartosLoading(true);
        const response = await api.get("/quartos?featured=1");
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setQuartos(data.map(withDisponibilidade));
      } catch (error) {
        console.error("Erro ao carregar quartos em destaque:", error);
        setQuartos(destaqueMock.map(withDisponibilidade));
      } finally {
        setQuartosLoading(false);
      }
    };

    fetchQuartos();
  }, []);

  const featuredQuartos = quartos.length
    ? [...quartos].sort((a, b) => (b.preco_por_dia ?? 0) - (a.preco_por_dia ?? 0)).slice(0, 3)
    : destaqueMock;

  const handleHeaderNav = (path) => {
    if (path === "/contact") {
      navigate(path);
      return;
    }
    if (user) {
      navigate(path);
      return;
    }
    navigate("/login");
  };

  const handleProtected = (path, options) => {
    if (user) {
      navigate(path, options);
      return;
    }
    navigate("/login");
  };

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value || 0);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "18px" }}>A carregar...</p>
      </div>
    );
  }

  const quartosEmDestaque = quartosLoading ? destaqueMock : featuredQuartos;

  return (
    <div className="home-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');

        :root {
          --blue-900: #0b1f5e;
          --blue-700: #163a88;
          --blue-500: #1f4fbe;
          --gold: #f4b400;
          --slate: #0f172a;
          --muted: #5b657a;
          --surface: #ffffff;
          --soft: #f3f6ff;
        }

        * {
          box-sizing: border-box;
        }

        .home-page {
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          color: var(--slate);
          background: var(--surface);
          line-height: 1.6;
        }

        .container {
          width: min(1200px, 92vw);
          margin: 0 auto;
        }

        .section-title {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 32px;
          text-align: center;
        }

        .featured {
          padding: 110px 0 60px;
          background: var(--soft);
        }

        .room-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-top: 20px;
        }

        .room-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
          display: flex;
          flex-direction: column;
          min-height: 5 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
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
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .room-card-btn:hover {
          background: #d97706;
        }

        .room-card-btn.disabled,
        .room-card-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          pointer-events: none;
        }

        .services {
          background: #e9efff;
          padding: 120px 0;
        }

        .services-card {
          background: var(--surface);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.14);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 36px;
          align-items: center;
        }

        .service-buttons {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .servicos-btn {
          background: var(--gold);
          color: #111;
          padding: 16px 18px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 800;
          font-size: 16px;
          width: 100%;
          box-shadow: 0 16px 35px rgba(244, 180, 0, 0.32);
          text-align: left;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .servicos-btn:hover {
          background: #ffce3a;
          transform: translateX(6px);
          box-shadow: 0 18px 38px rgba(244, 180, 0, 0.35);
        }

        .services-media img {
          width: 100%;
          border-radius: 18px;
          border: 5px solid var(--gold);
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
        }

        .cta-final {
          background: linear-gradient(120deg, var(--blue-900), var(--blue-500));
          color: #fff;
          text-align: center;
          padding: 90px 0;
        }

        .cta-final h2 {
          font-size: 30px;
          margin: 0 0 10px;
        }

        .cta-final p {
          margin: 0 0 22px;
          color: rgba(255, 255, 255, 0.86);
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cta-buttons a {
          padding: 12px 22px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.4px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .cta-btn-login {
          background: #fff;
          color: var(--slate);
        }

        .cta-btn-register {
          background: var(--gold);
          color: #111;
        }

        .cta-buttons a:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 1024px) {
          .section-title {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .services-card {
            padding: 28px;
          }
        }
      `}</style>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/55 to-blue-900/25" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-blue-950/30 to-transparent" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-extrabold leading-none tracking-tight sm:text-7xl lg:text-8xl">
              MAPHOTEL
            </h1>
            <p className="mt-4 text-lg font-medium text-white/90 sm:text-2xl">
              Reserve o seu quarto de forma fácil e visual.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
          <div className="mx-auto -mt-6 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:-mt-10 md:flex">
            <div
              className="h-40 w-full bg-cover bg-center sm:h-44 md:h-auto md:w-1/3"
              style={{ backgroundImage: `url(${heroCardImage})` }}
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 sm:gap-3">
                <div className="rounded-xl bg-gray-50 px-2 py-3 sm:p-3">
                  <div className="text-lg font-extrabold text-gray-900 sm:text-xl">24/7</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Suporte ao Cliente
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 px-2 py-3 sm:p-3">
                  <div className="text-lg font-extrabold text-gray-900 sm:text-xl">+30</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Quartos Disponíveis
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 px-2 py-3 sm:p-3">
                  <div className="text-lg font-extrabold text-gray-900 sm:text-xl">5</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Avaliação Média
                  </div>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-gray-900 sm:text-lg">
                Reserve o seu quarto com mapa interativo
              </h3>

              <button
                type="button"
                className="cta-btn-register w-full rounded-lg px-4 py-2.5 text-center text-sm font-extrabold transition-transform hover:-translate-y-0.5"
                onClick={() => handleProtected("/rooms")}
              >
                Ver Quartos Disponíveis
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2 className="section-title">Quartos</h2>
          <div className="room-grid">
            {quartosEmDestaque.map((quarto) => (
              <article key={quarto.id ?? quarto.numero} className="room-card">
                <div
                  className="room-card-image"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(
                      quarto.imagem,
                      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
                    )})`,
                  }}
                >
                  <span className={`room-badge ${quarto.disponivel === false ? "indisponivel" : ""}`}>
                    {quarto.disponivel === false ? "Indisponível" : "Disponível"}
                  </span>
                </div>
                <div className="room-card-content">
                  <div className="room-card-header">
                    <div>
                      <div className="room-type">{quarto.tipo || "Luxo"}</div>
                      <h3>
                        {quarto.nome || `Quarto ${quarto.tipo || "Luxo"}`} #{quarto.numero || quarto.id}
                      </h3>
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
                    <button
                      type="button"
                      disabled={quarto.disponivel === false}
                      className={`room-card-btn ${quarto.disponivel === false ? "disabled" : ""}`}
                      onClick={() => handleProtected(`/rooms/${quarto.id || quarto.numero}`, { state: { quarto } })}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container services-card">
          <div className="services-text">
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "22px" }}>
              Nossos Serviços
            </h2>
            <div className="service-buttons">
              <button type="button" className="servicos-btn" style={{ textAlign: "center" }}>
                Mapa interativo de quartos
              </button>
              <button type="button" className="servicos-btn" style={{ textAlign: "center" }}>
                Gestão de reservas fácil
              </button>
              <button type="button" className="servicos-btn" style={{ textAlign: "center" }}>
                Visualização em tempo real
              </button>
            </div>
          </div>
          <div className="services-media">
            <img src={swimmingPoolImg} alt="Piscina do hotel" />
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Crie sua conta e reserve seu quarto agora!</h2>
          <p>Acesso rápido, seguro e fácil a todos os nossos quartos.</p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-btn-login">
              Iniciar Sessão
            </Link>
            <Link to="/registar" className="cta-btn-register">
              Registar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
