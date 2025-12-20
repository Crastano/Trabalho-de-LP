import React from "react";
import { Link } from "react-router";
import interiorModernImg from "../assets/images/interior-modern.jpg";

export default function Privacidade() {
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

      <section
        className="legal-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${interiorModernImg}')`,
        }}
      >
        <div className="container legal-hero-inner">
          <h1>Política de Privacidade</h1>
          <div className="legal-breadcrumb">
            <Link to="/">HOME</Link>
          </div>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-card">
            <p>
              Esta Política de Privacidade explica, de forma simples, como o MAPHOTEL trata dados pessoais quando utilizas o nosso website e serviços.
            </p>

            <h2>1. Que dados podemos recolher</h2>
            <p>
              Dependendo do uso do site, podemos recolher dados como nome, email, dados de contacto e informações necessárias para gerir reservas e suporte.
            </p>

            <h2>2. Para que usamos os dados</h2>
            <p>
              Usamos os dados para: processar reservas, comunicar confirmações/alterações, prestar apoio ao cliente, melhorar o serviço e cumprir obrigações
              legais aplicáveis.
            </p>

            <h2>3. Partilha de dados</h2>
            <p>
              Não vendemos dados pessoais. Podemos partilhar dados apenas quando necessário para executar o serviço (ex.: processadores de pagamento) ou quando
              exigido por lei.
            </p>

            <h2>4. Segurança</h2>
            <p>
              Aplicamos medidas razoáveis de segurança para proteger a informação. Ainda assim, nenhum sistema é 100% imune a riscos.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Podemos utilizar cookies/tecnologias semelhantes para melhorar a experiência no site e analisar utilização. Podes gerir cookies nas definições do
              teu browser.
            </p>

            <h2>6. Os teus direitos</h2>
            <p>
              Podes pedir acesso, retificação ou eliminação de dados, quando aplicável. Para pedidos de privacidade, contacta-nos através do email indicado no
              rodapé.
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
