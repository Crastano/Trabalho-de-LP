import React, { useState } from 'react';
import { Link } from "react-router";

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Aqui pode integrar com API para guardar newsletter
        console.log('Newsletter email:', email);
        setEmail('');
        alert('Obrigado por se inscrever!');
    };

    return (
        <footer className="footer">
            <style>{`
                .footer {
                    background: linear-gradient(120deg, var(--blue-900, #0b1f5e), var(--blue-500, #1f4fbe));
                    color: white;
                    padding: 80px 0 36px;
                    font-family: 'Manrope', 'Segoe UI', sans-serif;
                }

                .footer-inner {
                    width: min(1200px, 92vw);
                    margin: 0 auto;
                }

                .footer-content {
                    max-width: 1200px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 36px;
                    margin-bottom: 28px;
                }

                .footer-section h3 {
                    font-size: 16px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    margin-bottom: 16px;
                    color: white;
                }

                .footer-section p {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.78);
                    line-height: 1.7;
                }

                .footer-section a {
                    display: block;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.78);
                    text-decoration: none;
                    margin-bottom: 12px;
                    transition: color 0.3s;
                }

                .footer-section a:hover {
                    color: white;
                }

                .footer-contact {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.78);
                }

                .footer-newsletter {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                }

                .footer-newsletter input {
                    flex: 1;
                    padding: 12px 14px;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 14px;
                    font-size: 14px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    outline: none;
                }

                .footer-newsletter input::placeholder {
                    color: rgba(255, 255, 255, 0.65);
                }

                .footer-newsletter input:focus {
                    border-color: rgba(255, 255, 255, 0.35);
                    background: rgba(255, 255, 255, 0.12);
                }

                .footer-newsletter button {
                    padding: 12px 18px;
                    background: var(--gold, #f4b400);
                    color: #111;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                }

                .footer-newsletter button:hover {
                    background: #ff3a3aff;
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(244, 180, 0, 0.3);
                }

                .footer-social {
                    display: flex;
                    gap: 16px;
                    margin-top: 16px;
                }

                .social-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.3s;
                    text-decoration: none;
                    color: white;
                    font-size: 14px;
                }

                .social-icon:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 22px;
                    text-align: center;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.72);
                }

                @media (max-width: 768px) {
                    .footer {
                        padding: 56px 0 28px;
                    }

                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }

                    .footer-newsletter {
                        flex-direction: column;
                    }
                }
            `}</style>

            <div className="footer-inner">
                <div className="footer-content">
                    {/* CONTACTO */}
                    <div className="footer-section">
                        <h3>CONTACTO</h3>
                        <div className="footer-contact">
                            📍 Hotel em Porto
                        </div>
                        <div className="footer-contact">
                            ☎️ +250846787
                        </div>
                        <div className="footer-contact">
                            ✉️ maphotel@gmail.com
                        </div>
                    </div>

                    {/* INFORMAÇÃO */}
                    <div className="footer-section">
                        <h3>INFORMAÇÃO</h3>
                        <Link to="/sobre">Sobre</Link>
                        <Link to="/termos">Termos de Uso</Link>
                        <Link to="/privacidade">Política de Privacidade</Link>
                        <a href="#mapa">Mapa</a>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="footer-section">
                        <h3>NEWSLETTER</h3>
                        <p>Subscreva a nossa newsletter para receberes as últimas notícias.</p>
                        <form onSubmit={handleNewsletterSubmit} className="footer-newsletter">
                            <input
                                type="email"
                                placeholder="Seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Envio</button>
                        </form>
                        <div className="footer-social">
                            <a href="#facebook" className="social-icon" title="Facebook">f</a>
                            <a href="#instagram" className="social-icon" title="Instagram">📷</a>
                            <a href="#twitter" className="social-icon" title="Twitter">𝕏</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2025 MAPHOTEL. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
