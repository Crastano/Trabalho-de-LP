import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Home() {
    const { user, loading } = useAuth();
    const [quartos, setQuartos] = useState([]);
    const [quartosLoading, setQuartosLoading] = useState(true);
    const [quartosError, setQuartosError] = useState(null);

    useEffect(() => {
        // Carregar quartos disponíveis da API
        const fetchQuartos = async () => {
            try {
                setQuartosLoading(true);
                const response = await api.get('/quartos');
                // A API retorna um array diretamente
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setQuartos(data);
                if (data.length === 0) {
                    setQuartosError(null); // Sem erro se vazio
                }
            } catch (error) {
                console.error('Erro ao carregar quartos:', error);
                // Não mostrar erro, apenas usar dados mock
                setQuartos([
                    { 
                        id: 1, 
                        numero: 101,
                        nome: 'Quarto Padrão', 
                        preco_por_dia: 140, 
                        tipo: 'Padrão', 
                        imagem: './src/assets/images/elegant-hotel.jpg',
                        capacidade: 2
                    },
                    { 
                        id: 2, 
                        numero: 201,
                        nome: 'Quarto Executivo', 
                        preco_por_dia: 280, 
                        tipo: 'Executivo', 
                        imagem: './src/assets/images/luxury-bedroom-hotel.jpg',
                        capacidade: 2
                    },
                    { 
                        id: 3, 
                        numero: 301,
                        nome: 'Quarto de Luxo', 
                        preco_por_dia: 400, 
                        tipo: 'Luxo', 
                        imagem: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=400&q=80',
                        capacidade: 2
                    }
                ]);
            } finally {
                setQuartosLoading(false);
            }
        };

        fetchQuartos();
    }, []);
    if (loading) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px" }}>A carregar...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            <style>{`
                .home-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                
                /* HERO SECTION */
                .hero {
                    position: relative;
                    height: 700px;
                    background-image: url('./src/assets/images/main.jpg');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 200px;
                    overflow: visible;
                }
                
                .hero::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: rgba(17, 42, 126, 0.5);
                    z-index: 1;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 2;
                    color: white;
                    max-width: 500px;
                }
                
                .hero h1 {
                    font-size: 140px;
                    font-weight: 800;
                    margin: 0px;
                    line-height: 1.0;
                }
                
                .hero p {
                    font-size: 35px;
                    margin: 0;
                    opacity: 0.95;
                    line-height: 1.2;
                }
                
                /* CARD FLUTUANTE */
                .hero-card {
                position: absolute;
                left: 50%;
                bottom: -120px;

                transform: translateX(-50%);
                background: white;
                border-radius: 12px;
                padding: 0;
                width: 800px;
                height: 250px;
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
                z-index: 3;
                display: flex;
                overflow: hidden;
                }

                
                .hero-card-image {
                    width: 270px;
                    height: auto;
                    min-height: 100%;
                    border-radius: 0;
                    background-image: url('./src/assets/images/interior-modern.jpg');
                    background-size: cover;
                    background-position: center;
                    float: none;
                    margin-right: 0;
                    margin-bottom: 0;
                    flex-shrink: 0;
                }
                
                .hero-card-content {
                    flex: 1;
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                
                .hero-card-info {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                    font-size: 16px;
                    clear: none;
                }
                
                .hero-card-info div {
                    text-align: center;
                    flex: 1;
                }
                
                .hero-card-info strong {
                    display: block;
                    font-size: 18px;
                    font-weight: 700;
                    color: #111;
                }
                
                .hero-card-info small {
                    color: #6b7280;
                    display: block;
                    font-size: 14px;
                    margin-top: 2px;
                }
                
                .hero-card h3 {
                    font-size: 18px;
                    margin: 0 0 18px 0;
                    text-align: center;
                    color: #111;
                    font-weight: 600;
                    line-height: 1.4;
                }
                
                .hero-card button {
                    width: 100%;
                    background: #f59e0b;
                    color: #111;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 18px;
                }
                
                /* SEÇÃO QUARTOS */
                .section {
                    padding: 80px;
                    margin-top: 180px;
                    text-align: center;
                }
                
                .section h2 {
                    font-size: 42px;
                    font-weight: 700;
                    margin-bottom: 40px;
                    color: #111;
                }
                
                /* GRID DE QUARTOS */
                .quartos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .quarto-card {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                    position: relative;
                }
                
                .quarto-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }
                
                .quarto-card-image {
                    width: 100%;
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                
                .quarto-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #1e3a8a;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .quarto-card-content {
                    padding: 16px;
                }
                
                .quarto-card h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    color: #111;
                }
                
                .quarto-card-price {
                    font-size: 20px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 8px;
                }
                
                .quarto-card-desc {
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 12px;
                    line-height: 1.4;
                }
                
                .quarto-card button {
                    width: 100%;
                    background: #f59e0b;
                    color: #111;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                }
                
                /* SEÇÃO SERVIÇOS */
                .servicos-section {
                    background: #E9ECF5;
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    padding: 60px;
                    max-width: 2400px;
                    margin: 0 auto;
                }
                
                .servicos-left {
                    flex: 1;
                }
                
                .servicos-right {
                    flex: 1;
                }
                
                .servicos-right img {
                    width: 100%;
                    height: auto;
                    border-radius: 0px;
                    border: 3px solid #f59e0b;
                }
                
                .servicos-btn {
                    background: #f59e0b;
                    color: #111;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 24px;
                    width: 100%;
                    margin-bottom: 12px;
                    text-align: center;
                    transition: all 0.3s;
                }
                
                .servicos-btn:hover {
                    background: #d97706;
                    transform: scale(1.02);
                }
                
                /* CTA FINAL */
                .cta-final {
                    background: #f9fafb;
                    padding: 140px;
                    text-align: center;
                }
                
                .cta-final h2 {
                    color: #1e3a8a;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                
                .cta-final p {
                    color: #6b7280;
                    font-size: 18px;
                    margin-bottom: 24px;
                }
                
                .cta-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .cta-buttons button, .cta-buttons a {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.3s;
                }
                
                .cta-btn-login {
                    background: #2563eb;
                    color: white;
                }
                
                .cta-btn-login:hover {
                    background: #1d4ed8;
                }
                
                .cta-btn-register {
                    background: #f59e0b;
                    color: #111;
                }
                
                .cta-btn-register:hover {
                    background: #d97706;
                }
                
                /* LAYOUT DE NÃO AUTENTICADO */
                .home-auth-message {
                    text-align: center;
                    padding: 40px;
                }
                
                .home-auth-message h3 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                
                .home-auth-message a {
                    display: inline-block;
                    margin: 10px 8px;
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                
                @media (max-width: 1024px) {
                    .hero { 
                        height: 500px; 
                        padding: 0 40px;
                    }
                    .hero h1 { font-size: 42px; }
                    .hero-card { width: 480px; }
                }
                
                @media (max-width: 768px) {
                    .hero {
                        height: auto;
                        min-height: 500px;
                        padding: 40px 24px;
                        flex-direction: column;
                        gap: 30px;
                        justify-content: center;
                    }
                    .hero-content {
                        text-align: center;
                        max-width: 100%;
                    }
                    .hero h1 { font-size: 36px; }
                    .hero p { font-size: 16px; }
                    .hero-card {
                        width: 100%;
                        max-width: 420px;
                        margin: 0 auto;
                        flex-direction: column;
                    }
                    .hero-card-image {
                        width: 100%;
                        height: 200px;
                    }
                    .hero-card-content {
                        padding: 20px;
                    }
                    .section { padding: 40px 24px; }
                }
            `}</style>

            {/* HERO SECTION */}
            <div className="hero">
                <div className="hero-content">
                    <h1>MAPHOTEL</h1>
                    <p>Reserve o seu quarto de forma fácil e visual.</p>
                </div>
                
                <div className="hero-card">
                    <div className="hero-card-image"></div>
                    
                    <div className="hero-card-content">
                        <div className="hero-card-info">
                            <div>
                                <strong>24/7</strong>
                                <small>Suporte ao Cliente</small>
                            </div>
                            <div>
                                <strong>+100</strong>
                                <small>Quartos Disponíveis</small>
                            </div>
                            <div>
                                <strong>5 ★</strong>
                                <small>Avaliação Média</small>
                            </div>
                        </div>
                        
                        <h3>Reserve o seu quarto com mapa interativo</h3>
                        <button>📍 Ver Quartos Disponíveis</button>
                    </div>
                </div>
            </div>

            {/* SEÇÃO PARA CLIENTES */}
            {user && user.cargo === 'cliente' && (
                <div className="section" style={{ background: '#f9fafb' }}>
                    <h2>Bem-vindo, {user.name}! 👋</h2>
                    <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
                        Explore nossos quartos disponíveis e faça sua reserva agora.
                    </p>
                    <Link to="/perfil" style={{
                        display: 'inline-block',
                        background: '#2563eb',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        Ver Meu Perfil
                    </Link>
                </div>
            )}

            {/* SEÇÃO PARA ADMINISTRADORES */}
            {user && user.cargo === 'administrador' && (
                <div className="section" style={{ background: '#f9fafb' }}>
                    <h2>Painel de Administração 🔧</h2>
                    <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
                        Gerencie seus quartos e reservas.
                    </p>
                    <Link to="/quartos" style={{
                        display: 'inline-block',
                        background: '#dc2626',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>
                        Gestão de Quartos
                    </Link>
                </div>
            )}

            {/* ESPAÇO PARA PRÓXIMAS SEÇÕES (Quartos, Serviços, etc.) */}
            <div className="section" style={{ paddingTop: '40px', background: 'white' }}>
                <h2>Quartos</h2>
                {quartosLoading ? (
                    <p style={{ color: '#6b7280' }}>A carregar quartos...</p>
                ) : quartos.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Nenhum quarto disponível no momento.</p>
                ) : (
                    <div className="quartos-grid">
                        {quartos.map((quarto) => (
                            <div key={quarto.id} className="quarto-card">
                                <div className="quarto-card-image" style={{
                                    backgroundImage: `url('${quarto.imagem || 'https://via.placeholder.com/400x200?text=Quarto'}')`
                                }}>
                                    <div className="quarto-badge">Disponível</div>
                                </div>
                                <div className="quarto-card-content">
                                    <h3>Quarto {quarto.tipo || 'Padrão'} #{quarto.numero}</h3>
                                    <div className="quarto-card-price">{quarto.preco_por_dia || quarto.preco || '---'} €</div>
                                    <div className="quarto-card-desc">
                                        ⭐ Capacidade: {quarto.capacidade} pessoas<br/>
                                        💻 WiFi | 📺 TV
                                    </div>
                                    <button onClick={() => alert(`Reservar: Quarto ${quarto.tipo} #${quarto.numero}`)}>BOOK NOW</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SEÇÃO SERVIÇOS */}
            <div style={{ background: '#E9ECF5', padding: '60px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '38px', fontWeight:'700', marginBottom: '40px', color: '#111' }}>Nossos Serviços</h2>
                <div className="servicos-section">
                    <div className="servicos-left">
                        <button className="servicos-btn">🗺️ Mapa interativo de quartos</button>
                        <button className="servicos-btn">📅 Gestão de reservas fácil</button>
                        <button className="servicos-btn">📊 Visualização de disponibilidade em tempo real</button>
                    </div>
                    <div className="servicos-right">
                        <img src="./src/assets/images/swimming-pool.jpg" />
                    </div>
                </div>
            </div>

            {/* CTA FINAL */}
            {!user && (
                <div className="cta-final">
                    <h2>Crie sua conta e reserve seu quarto agora!</h2>
                    <p>Acesso rápido, seguro e fácil a todos os nossos quartos.</p>
                    <div className="cta-buttons">
                        <Link to="/login" className="cta-btn-login">Iniciar Sessão</Link>
                        <Link to="/registar" className="cta-btn-register">Registar</Link>
                    </div>
                </div>
            )}
        </div>
    );
}