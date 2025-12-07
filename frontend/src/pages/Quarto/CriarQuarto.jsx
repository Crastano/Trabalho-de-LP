import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../../utils/notify';

export default function QuartoCriar() {
    const navigate = useNavigate();

    const [andares, setAndares] = useState([]);
    const [loadingAndares, setLoadingAndares] = useState(true);

    const [form, setForm] = useState({
        id: "",
        andar_id: "",
        tipo: "padrao",
        capacidade: "",
        estado: "livre",
        preco_por_dia: ""
    });

    const [loading, setLoading] = useState(false);

    const fetchAndares = async () => {
        try {
            const response = await api.get("/andares");
            setAndares(response.data);
        } catch (error) {
            console.error("Erro ao carregar andares:", error);
        } finally {
            setLoadingAndares(false);
        }
    };

    useEffect(() => {
        fetchAndares();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/quartos", form);
            navigate("/quartos");
            mostrarSucessoMensagem(response.data.message);
        } catch (error) {
            mostrarErroMensagem(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingAndares) {
        return (
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", height: "100vh"
            }}>
                <p style={{ fontSize: "18px" }}>A carregar andares...</p>
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
                    Criar Novo Quarto
                </h1>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                }}>
                    <Link to="/quartos"
                        style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            background: "#2563eb",
                            marginTop: "10px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "white"
                        }}>
                        ← Voltar à Lista
                    </Link>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <Input label="Número do quarto" name="id" value={form.id} onChange={handleChange} />
                    
                    {/* ANDAR */}
                    <div>
                        <label>Andar:</label>
                        <select
                            name="andar_id"
                            value={form.andar_id}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="">Selecione um andar</option>
                            {andares.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input label="Capacidade" name="capacidade" value={form.capacidade} onChange={handleChange} />
                    <Input label="Preço por dia (€)" name="preco_por_dia" value={form.preco_por_dia} onChange={handleChange} />

                    {/* TIPO */}
                    <div>
                        <label>Tipo:</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="padrao">Padrão</option>
                            <option value="luxo">Luxo</option>
                            <option value="executivo">Executivo</option>
                        </select>
                    </div>

                    {/* ESTADO */}
                    <div>
                        <label>Estado:</label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="livre">Livre</option>
                            <option value="ocupado">Ocupado</option>
                        </select>
                    </div>

                    {/* Botão */}
                    <button type="submit" style={btnCriar}>
                        {!loading ? "Criar Quarto" : "A criar..."}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* COMPONENTES REUTILIZÁVEIS */
function Input({ label, name, value, onChange }) {
    return (
        <div>
            <label>{label}:</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "4px"
                }}
            />
        </div>
    );
}

/* ESTILOS */
const selectStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "4px"
};

const btnCriar = {
    marginTop: "10px",
    padding: "12px",
    background: "#16a34a",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px"
};
