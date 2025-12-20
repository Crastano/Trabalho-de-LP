import React from "react";
import { Link } from "react-router";

export default function Sobre() {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.7;
        }

        .container {
          width: min(1200px, 92vw);
          margin: 0 auto;
        }

        .about-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('./src/assets/images/small-hotel.jpg');
          background-size: cover;
          background-position: center;
          height: 340px;
          color: white;
          padding: 80px 0;
          display: flex;
          align-items: center;
        }

        .about-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .about-hero h1 {
          font-size: 56px;
          font-weight: 800;
          margin: 0;
        }

        .about-hero p {
          margin: 10px 0 0;
          opacity: 0.95;
          font-size: 16px;
          max-width: 720px;
        }

        .about-breadcrumb {
          margin-top: 12px;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .about-breadcrumb a {
          color: white;
          text-decoration: none;
        }

        .about-content {
          padding: 64px 0 90px;
          background: #ffffff;
        }

        .about-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .about-card h2 {
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 12px;
          color: #1e3a8a;
        }

        .about-card p {
          margin: 0 0 14px;
          color: #475569;
          font-size: 15px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }

        .about-pill {
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 16px 16px;
          background: #f8fafc;
          color: #334155;
          font-size: 14px;
        }

        .about-pill strong {
          display: block;
          color: #0f172a;
          margin-bottom: 6px;
          font-weight: 800;
        }

        @media (max-width: 960px) {
          .about-hero h1 {
            font-size: 44px;
          }
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="about-hero">
        <div className="container about-hero-inner">
          <h1>Sobre</h1>
          <div className="about-breadcrumb">
            <Link to="/">HOME</Link>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-card">
            <h2>O nosso hotel</h2>
            <p>
              O MAPHOTEL é um hotel pensado para quem valoriza conforto e praticidade. Quer venhas em trabalho, em família ou numa escapadinha a dois,
              o nosso objetivo é que encontres um espaço acolhedor, com um serviço rápido e transparente — desde a reserva até ao check-out.
            </p>
            <p>
              Apostamos numa experiência moderna: quartos bem equipados, ambiente tranquilo e uma equipa sempre disponível para ajudar. Acreditamos que os
              detalhes fazem a diferença — limpeza, organização, comodidade e uma comunicação clara.
            </p>
            <p>
              A nossa localização no Porto ajuda-te a explorar a cidade com facilidade, sem abdicar de descanso. Reserva em poucos passos e acompanha a
              disponibilidade em tempo real.
            </p>

            <div className="about-grid">
              <div className="about-pill">
                <strong>Conforto</strong>
                Quartos espaçosos, camas confortáveis e um ambiente pensado para descansar.
              </div>
              <div className="about-pill">
                <strong>Confiança</strong>
                Processo de reserva simples, informação clara e suporte ao cliente quando precisares.
              </div>
              <div className="about-pill">
                <strong>Experiência</strong>
                Uma estadia prática, moderna e alinhada com o que esperas de um hotel atual.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
