import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import api from '../../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../../utils/notify';

export default function QuartoVer() {
    const { id } = useParams();
    const [quarto, setQuarto] = useState(null);
    const [loading, setLoading] = useState(true);

    // Formatar tipo
    const formatTipo = (tipo) => {
        const tipos = {
            padrao: "Padrão",
            luxo: "Luxo",
            executivo: "Executivo"
        };
        return tipos[tipo] || tipo;
    };

    // Formatar estado
    const formatEstado = (estado) => {
        const estados = {
            livre: "Livre",
            ocupado: "Ocupado"
        };
        return estados[estado] || estado;
    };

    const fetchQuarto = async () => {
        try {
            const response = await api.get(`/quartos/${id}`);
            setQuarto(response.data);
        } catch (error) {
            console.error("Erro ao carregar quarto:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuarto();
        console.log(id);
    }, []);

    if (loading) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px" }}>A carregar quarto...</p>
            </div>
        );
    }

    if (!quarto) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px", color: "red" }}>Quarto não encontrado.</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "60px"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                width: "600px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>

                <h1 style={{ fontSize: "28px", marginBottom: "20px", textAlign: "center" }}>
                    Quarto Nº {quarto.id}
                </h1>

                {/* Links */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                }}>
                    <Link to="/quartos" style={{ color: "#2563eb" }}>
                        ← Voltar à Lista
                    </Link>

                    <Link
                        to={`/quartos/editar/${quarto.id}`}
                        style={{
                            padding: "8px 14px",
                            background: "#f59e0b",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}
                    >
                        Editar Quarto
                    </Link>
                </div>

                {/* Informação */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <Info label="Número do quarto" value={quarto.numero} />
                    <Info label="Andar" value={quarto.andar_id} />
                    <Info label="Tipo" value={formatTipo(quarto.tipo)} />
                    <Info label="Capacidade" value={`${quarto.capacidade} pessoas`} />
                    <Info label="Estado" value={formatEstado(quarto.estado)} />
                    <Info label="Preço por dia" value={`${quarto.preco_por_dia} €`} />
                    <Info label="Posição X" value={quarto.posicao_x} />
                    <Info label="Posição Y" value={quarto.posicao_y} />
                </div>
            </div>
        </div>
    );
}

/* Componente para mostrar linha de informação */
function Info({ label, value }) {
    return (
        <div style={{
            background: "#f9fafb",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px"
        }}>
            <strong>{label}:</strong>
            <span>{value}</span>
        </div>
    );
}
