import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../../utils/notify';

export default function QuartosLista() {
    const [quartos, setQuartos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuartos = async () => {
        try {
            const response = await api.get("/quartos");
            setQuartos(response.data);
        } catch (error) {
            mostrarErroMensagem(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuartos();
    }, []);

    const apagarQuarto = async (id) => {
        if (!confirm("Tens a certeza que queres apagar este quarto?")) return;

        try {
            const response = await api.delete(`/quartos/${id}`);
            setQuartos(quartos.filter(q => q.id !== id));
            mostrarSucessoMensagem(response.data.message);
        } catch (error) {
            mostrarErroMensagem(error);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px" }}>A carregar quartos...</p>
            </div>
        );
    }

    const formatTipo = (tipo) => {
        const tipos = {
            padrao: "Padrão",
            luxo: "Luxo",
            executivo: "Executivo"
        };
        return tipos[tipo] || tipo;
    };

    const formatEstado = (estado) => {
        const estados = {
            livre: "Livre",
            ocupado: "Ocupado"
        };
        return estados[estado] || estado;
    };

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
                width: "750px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>
                <h1 style={{ fontSize: "28px", marginBottom: "20px", textAlign: "center" }}>
                    Lista de Quartos
                </h1>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link
                        to="/"
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            padding: "10px 20px",
                            background: "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}>Home</Link>
                    <Link
                        to="/quartos/criar"
                        style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            background: "#16a34a",
                            marginTop: "10px",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}
                    >
                        + Criar Quarto
                    </Link>
                </div>

                {/* Tabela */}
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "25px"
                }}>
                    <thead>
                        <tr style={{ background: "#e5e7eb" }}>
                            <th style={th}>Número</th>
                            <th style={th}>Andar</th>
                            <th style={th}>Tipo</th>
                            <th style={th}>Capacidade</th>
                            <th style={th}>Estado</th>
                            <th style={th}>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {quartos.map(quarto => (
                            <tr key={quarto.id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={td}>{quarto.numero}</td>
                                <td style={td}>{quarto.andar_id}</td>
                                <td style={td}>{formatTipo(quarto.tipo)}</td>
                                <td style={td}>{quarto.capacidade}</td>
                                <td style={td}>{formatEstado(quarto.estado)}</td>

                                <td style={{ ...td, textAlign: "center" }}>
                                    <Link to={`/quartos/ver/${quarto.id}`} style={btnVer}>
                                        Ver
                                    </Link>

                                    <Link to={`/quartos/editar/${quarto.id}`} style={btnEditar}>
                                        Editar
                                    </Link>

                                    <button
                                        onClick={() => apagarQuarto(quarto.id)}
                                        style={btnApagar}
                                    >
                                        Apagar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* Estilos simples e consistentes */
const th = {
    padding: "12px",
    fontWeight: "bold",
    textAlign: "left"
};

const td = {
    padding: "12px"
};

const btnVer = {
    padding: "6px 10px",
    background: "#2563eb",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    marginRight: "6px",
    fontSize: "14px"
};

const btnEditar = {
    padding: "6px 10px",
    background: "#f59e0b",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    marginRight: "6px",
    fontSize: "14px"
};

const btnApagar = {
    padding: "6px 10px",
    background: "#dc2626",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
};
