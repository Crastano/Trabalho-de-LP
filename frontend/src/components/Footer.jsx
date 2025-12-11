import React, { useState } from 'react';

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
                    background: #1e3a8a;
                    color: white;
                    padding: 60px;
                }

                .footer-content {
                    max-width: 1000px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 40px;
                    margin-bottom: 40px;
                }

                .footer-section h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: white;
                }

                .footer-section p {
                    font-size: 18px;
                    color: #ccc;
                    line-height: 1.6;
                }

                .footer-section a {
                    display: block;
                    font-size: 18px;
                    color: #ccc;
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
                    font-size: 18px;
                    color: #ccc;
                }

                .footer-newsletter {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                }

                .footer-newsletter input {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 4px;
                    font-size: 18px;
                }

                .footer-newsletter button {
                    padding: 8px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 18px;
                    transition: background 0.3s;
                }

                .footer-newsletter button:hover {
                    background: #dc2626;
                }

                .footer-social {
                    display: flex;
                    gap: 16px;
                    margin-top: 16px;
                }

                .social-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.3s;
                    text-decoration: none;
                    color: white;
                    font-size: 16px;
                }

                .social-icon:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 60px;
                    text-align: center;
                    font-size: 14px;
                    color: #ddddddff;
                }

                @media (max-width: 768px) {
                    .footer {
                        padding: 40px 24px;
                    }

                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                }
            `}</style>

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
                    <a href="#sobre">Sobre</a>
                    <a href="#termos">Termos de Uso</a>
                    <a href="#privacidade">Política de Privacidade</a>
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
        </footer>
    );
}
