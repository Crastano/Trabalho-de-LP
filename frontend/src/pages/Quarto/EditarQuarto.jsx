import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../../api/api';
import { mostrarErroMensagem, mostrarSucessoMensagem } from '../../utils/notify';

export default function QuartoEditar() {
    const { id } = useParams(); // ID do quarto pela rota
    const navigate = useNavigate();

    const [andares, setAndares] = useState([]);
    const [loadingAndares, setLoadingAndares] = useState(true);

    const [form, setForm] = useState({
        numero: "",
        andar_id: "",
        tipo: "",
        capacidade: "",
        estado: "",
        preco_por_dia: "",
        posicao_x: "",
        posicao_y: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Buscar lista de andares
    const fetchAndares = async () => {
        try {
            const response = await api.get("/andares");
            setAndares(response.data);
        } catch (error) {
            mostrarErroMensagem("Erro ao carregar andares:", error);
        } finally {
            setLoadingAndares(false);
        }
    };

    // Buscar dados do quarto
    const fetchQuarto = async () => {
        try {
            const response = await api.get(`/quartos/${id}`);
            setForm(response.data);
        } catch (error) {
            mostrarErroMensagem("Erro ao carregar quarto:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndares();
        fetchQuarto();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...form,
                andar_id: parseInt(form.andar_id) || null,
                capacidade: parseInt(form.capacidade) || null,
                preco_por_dia: parseFloat(form.preco_por_dia) || 0,
                posicao_x: parseInt(form.posicao_x) || 0,
                posicao_y: parseInt(form.posicao_y) || 0,
            };

            const response = await api.put(`/quartos/${id}`, payload);
            navigate(`/quartos/ver/${id}`);
            mostrarSucessoMensagem(response.data.message)
        } catch (error) {
            mostrarErroMensagem(error.response.data.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || loadingAndares) {
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
                    Editar Quarto Nº {form.numero}
                </h1>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                }}>
                    <Link to={`/quartos/ver/${id}`} style={{ color: "#2563eb" }}>
                        ← Voltar a ver quarto
                    </Link>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <NumberInput label="Número do quarto" name="numero" value={form.numero} onChange={handleChange} />

                    {/* ANDAR */}
                    <div>
                        <label>Andar:</label>
                        <select
                            name="andar_id"
                            value={form.andar_id}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            {andares.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* OUTROS CAMPOS */}
                    <NumberInput label="Capacidade" name="capacidade" value={form.capacidade} onChange={handleChange} />
                    <NumberInput label="Preço por dia (€)" name="preco_por_dia" value={form.preco_por_dia} onChange={handleChange} />
                    <NumberInput label="Posição X" name="posicao_x" value={form.posicao_x} onChange={handleChange} />
                    <NumberInput label="Posição Y" name="posicao_y" value={form.posicao_y} onChange={handleChange} />

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

                    <button type="submit" style={btnSalvar}>
                        {!saving ? "Guardar Alterações" : "A guardar..."}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* COMPONENTES */
function NumberInput({ label, name, value, onChange }) {
    return (
        <div>
            <label>{label}:</label>
            <input
                type="number"
                name={name}
                value={value}
                onChange={(e) => {
                    onChange({ target: { name, value: e.target.value } });
                }}
                step="1"
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

const btnSalvar = {
    marginTop: "10px",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px"
};
