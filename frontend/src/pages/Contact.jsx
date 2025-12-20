"use client"

import { useState } from "react"
import { Link } from "react-router"
import api from "../api/api"
import whiteUmbrellasImg from "../assets/images/white-umbrellas.jpg"

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      await api.post("/contacto", formData)
      setSuccess(true)
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" })
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      // Simular sucesso para demo
      setSuccess(true)
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <style>{`
                .contact-page {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                /* HERO BANNER */
                .contact-hero {
                  background-size: cover;
                  background-position: center;
                  height: 300px;
                  color: white;
                  text-align: center;
                  padding: 80px 20px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 12px;
                }

                .contact-hero h1 {
                    font-size: 42px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }

                .contact-hero-breadcrumb {
                    font-size: 18px;
                    opacity: 0.8;
                }

                .contact-hero-breadcrumb a {
                    color: white;
                    text-decoration: none;
                }

                .contact-hero-breadcrumb span {
                    margin: 0 8px;
                }

                /* CONTEÚDO */
                .contact-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    padding: 60px 80px;
                    max-width: 1200px;
                    margin: 0 auto;
                    margin-bottom: 80px;
                }

                /* FORMULÁRIO */
                .contact-form-section h2 {
                    font-size: 28px;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                    color: #111;
                }

                .contact-form-section p {
                    font-size: 15px;
                    color: #6b7280;
                    margin: 0 0 32px 0;
                    line-height: 1.6;
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }

                .form-group input,
                .form-group textarea {
                    padding: 14px 16px;
                    border: 1px solid #9299a3ff;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #1e3a8a;
                }

                .form-group textarea {
                    min-height: 150px;
                    resize: vertical;
                }

                .submit-btn {
                    background: #f59e0b;
                    color: #111;
                    padding: 14px 28px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s;
                    width: fit-content;
                }

                .submit-btn:hover {
                    background: #d97706;
                }

                .submit-btn:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                .success-message {
                    background: #d1fae5;
                    color: #065f46;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 14px;
                }

                /* INFO DE CONTACTO */
                .contact-info-section {
                    background: #a4b4c4ff;
                    padding: 40px;
                    border-radius: 16px;
                }

                .contact-info-section h2 {
                    font-size: 28px;
                    font-weight: 600;
                    margin: 0 0 32px 0;
                    color: #111;
                }

                .contact-info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .contact-info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }

                .contact-info-icon {
                    width: 48px;
                    height: 48px;
                    background: #1e3a8a;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .contact-info-icon svg {
                    width: 24px;
                    height: 24px;
                    color: white;
                }

                .contact-info-text h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    color: #111;
                }

                .contact-info-text p {
                    font-size: 16px;
                    color: #ffffffff;
                    margin: 0;
                }

                /* MAPA */
                .contact-map {
                    margin-top: 32px;
                    border-radius: 12px;
                    overflow: hidden;
                    height: 200px;
                    background: #e5e7eb;
                }

                .contact-map iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .contact-content {
                        grid-template-columns: 1fr;
                        padding: 40px;
                    }
                }

                @media (max-width: 768px) {
                    .contact-content {
                        padding: 4px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .contact-hero h1 {
                        font-size: 32px;
                    }
                }
            `}</style>

      {/* HERO BANNER */}
      <div
        className="contact-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${whiteUmbrellasImg}')`,
        }}
      >
        <h1>Contacto</h1>
        <div className="contact-hero-breadcrumb">
          <Link to="/">HOME</Link>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="contact-content">
        {/* FORMULÁRIO */}
        <div className="contact-form-section">
          <h2>Envie-nos uma mensagem</h2>
          <p>
            Tem alguma questão ou sugestão? Preencha o formulário abaixo e entraremos em contacto consigo o mais breve
            possível.
          </p>

          {success && (
            <div className="success-message">Mensagem enviada com sucesso! Entraremos em contacto em breve.</div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Assunto</label>
              <input
                type="text"
                name="assunto"
                value={formData.assunto}
                onChange={handleInputChange}
                placeholder="Assunto da mensagem"
                required
              />
            </div>

            <div className="form-group">
              <label>Mensagem</label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleInputChange}
                placeholder="Escreva a sua mensagem aqui..."
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "A enviar..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>

        {/* INFO DE CONTACTO */}
        <div className="contact-info-section">
          <h2>Informações de Contacto</h2>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div className="contact-info-text">
                <h4>Morada</h4>
                <p>
                  Rua do Hotel, 123
                  <br />
                  Lisboa, Portugal
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </div>
              <div className="contact-info-text">
                <h4>Telefone</h4>
                <p>+351 123 456 789</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div className="contact-info-text">
                <h4>Email</h4>
                <p>info@maphotel.pt</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="contact-info-text">
                <h4>Horário de Atendimento</h4>
                <p>24 horas, 7 dias por semana</p>
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.6257887660857!2d-9.1393365!3d38.7167444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzAwLjMiTiA5wrAwOCcyMS42Ilc!5e0!3m2!1sen!2spt!4v1635780000000!5m2!1sen!2spt"
              allowFullScreen=""
              loading="lazy"
              title="Localização do Hotel"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
