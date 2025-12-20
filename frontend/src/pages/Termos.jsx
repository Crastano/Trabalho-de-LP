import React from "react";
import { Link } from "react-router";

export default function Termos() {
  return (
    <div className="legal-page">
      <style>{`
        .legal-page {
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.7;
        }

        .container {
          width: min(1200px, 92vw);
          margin: 0 auto;
        }

        .legal-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('./src/assets/images/interior-modern.jpg');
          background-size: cover;
          background-position: center;
          height: 320px;
          color: white;
          padding: 78px 0;
          display: flex;
          align-items: center;
        }

        .legal-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .legal-hero h1 {
          font-size: 48px;
          font-weight: 800;
          margin: 0;
        }

        .legal-breadcrumb {
          margin-top: 12px;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .legal-breadcrumb a {
          color: white;
          text-decoration: none;
        }

        .legal-content {
          padding: 64px 0 90px;
          background: #ffffff;
        }

        .legal-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .legal-card h2 {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 1px;
          margin: 22px 0 10px;
          color: #1e3a8a;
        }

        .legal-card h2:first-child {
          margin-top: 0;
        }

        .legal-card p {
          margin: 0 0 12px;
          color: #475569;
          font-size: 15px;
        }

        .legal-muted {
          margin-top: 16px;
          font-size: 13px;
          color: #64748b;
        }

        @media (max-width: 960px) {
          .legal-hero h1 {
            font-size: 38px;
          }
        }
      `}</style>

      <section className="legal-hero">
        <div className="container legal-hero-inner">
          <h1>Termos de Uso</h1>
          <div className="legal-breadcrumb">
            <Link to="/">HOME</Link>
          </div>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-card">
            <p>
              Estes Termos de Uso descrevem as regras de utilização do website e dos serviços do MAPHOTEL. Ao navegar no site ou efetuar uma reserva,
              assumes que leste e aceitaste estes termos.
            </p>

            <h2>1. Utilização do website</h2>
            <p>
              Podes usar o site para consultar informações, verificar disponibilidade e efetuar reservas. Comprometes-te a não utilizar o site de forma
              abusiva, fraudulenta ou que prejudique outros utilizadores.
            </p>

            <h2>2. Reservas e pagamentos</h2>
            <p>
              As reservas estão sujeitas à disponibilidade e à confirmação. Os preços apresentados podem variar consoante datas, tipo de quarto e condições
              aplicáveis. Quando aplicável, o pagamento e/ou garantia podem ser necessários para confirmar a reserva.
            </p>

            <h2>3. Cancelamentos e alterações</h2>
            <p>
              As condições de cancelamento e alteração podem variar conforme a tarifa. Recomendamos verificar sempre as condições apresentadas no momento da
              reserva.
            </p>

            <h2>4. Conduta do hóspede</h2>
            <p>
              Durante a estadia, o hóspede deve respeitar as regras internas do hotel, incluindo segurança, ruído e conservação das instalações.
            </p>

            <h2>5. Conteúdos e propriedade</h2>
            <p>
              Os conteúdos do site (textos, imagens e marca) pertencem ao MAPHOTEL ou a terceiros autorizados. Não é permitida a utilização sem autorização.
            </p>

            <h2>6. Responsabilidade</h2>
            <p>
              Procuramos manter a informação atualizada e correta, mas podem existir erros pontuais. O MAPHOTEL não garante disponibilidade contínua do
              website e pode efetuar alterações a qualquer momento.
            </p>

            <p className="legal-muted">
              Última atualização: dezembro de 2025.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
