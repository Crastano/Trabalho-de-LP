<?php

namespace App\Http\Controllers;

use App\Models\Quarto;
use App\Models\Reserva;
use App\Enums\QuartoEstado;
use App\Enums\QuartoTipo;
use App\Enums\ReservaEstado;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class QuartoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Quarto::orderBy('numero', 'asc');

        if ($request->boolean('featured')) {
            $query->where('destaque', true);
        }

        return $query->get();
    }

    /**
     * Disponibilidade de quartos num intervalo de datas.
     * Retorna quartos com campo extra "disponivel" calculado por:
     * - estado do quarto (ex.: ocupado)
     * - existência de reservas sobrepostas no intervalo
     */
    public function disponibilidade(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'nullable|string',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
        ]);

        $tipo = $validated['tipo'] ?? null;
        $dataInicio = $validated['data_inicio'];
        $dataFim = $validated['data_fim'];

        $query = Quarto::orderBy('numero', 'asc');

        if ($tipo) {
            $query->whereRaw('LOWER(tipo) = ?', [mb_strtolower($tipo)]);
        }

        $quartos = $query->get();
        $quartoIds = $quartos->pluck('id');

        $ocupadosIds = Reserva::whereIn('quarto_id', $quartoIds)
            ->where('estado', '!=', ReservaEstado::CANCELADO->value)
            ->where(function ($q) use ($dataInicio, $dataFim) {
                $q->where('data_inicio', '<', $dataFim)
                    ->where('data_fim', '>', $dataInicio);
            })
            ->pluck('quarto_id')
            ->unique()
            ->values();

        $ocupadosSet = array_fill_keys($ocupadosIds->all(), true);

        return $quartos->map(function ($quarto) use ($ocupadosSet) {
            $estadoRaw = $quarto->estado;
            if ($estadoRaw instanceof \BackedEnum) {
                $estado = $estadoRaw->value;
            } elseif (is_string($estadoRaw)) {
                $estado = $estadoRaw;
            } elseif ($estadoRaw === null) {
                $estado = '';
            } else {
                $estado = (string) $estadoRaw;
            }

            $estado = mb_strtolower($estado);
            $ocupadoPorEstado = $estado === 'ocupado';

            $disponivel = !$ocupadoPorEstado && !isset($ocupadosSet[$quarto->id]);

            return array_merge($quarto->toArray(), [
                'disponivel' => $disponivel,
            ]);
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|integer',
            'andar_id' => 'required|exists:andars,id',
            'tipo' => ['required', 'string', Rule::in(array_map(fn($c) => $c->value, QuartoTipo::cases()))],
            'capacidade' => 'required|integer',
            'estado' => ['required', 'string', Rule::in(array_map(fn($c) => $c->value, QuartoEstado::cases()))],
            'preco_por_dia' => 'required|numeric',
            'posicao_x' => 'nullable|integer',
            'posicao_y' => 'nullable|integer',
            'imagem' => 'nullable|string',
            'destaque' => 'nullable|boolean',
            'camas' => 'nullable|string',
            'wifi' => 'nullable|boolean',
            'ar_condicionado' => 'nullable|boolean',
            'tv' => 'nullable|boolean',
            'descricao' => 'nullable|string',
        ]);

        $quarto = Quarto::create($validated);

        return response()->json([
            'message' => 'Quarto criado com sucesso!',
            'data' => $quarto,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Quarto $quarto)
    {
        return $quarto;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quarto $quarto)
    {
        $validated = $request->validate([
            'numero' => 'integer',
            'andar_id' => 'exists:andars,id',
            'tipo' => ['string', Rule::in(array_map(fn($c) => $c->value, QuartoTipo::cases()))],
            'capacidade' => 'integer',
            'estado' => ['string', Rule::in(array_map(fn($c) => $c->value, QuartoEstado::cases()))],
            'preco_por_dia' => 'numeric',
            'posicao_x' => 'nullable|integer',
            'posicao_y' => 'nullable|integer',
            'imagem' => 'nullable|string',
            'destaque' => 'nullable|boolean',
            'camas' => 'nullable|string',
            'wifi' => 'nullable|boolean',
            'ar_condicionado' => 'nullable|boolean',
            'tv' => 'nullable|boolean',
            'descricao' => 'nullable|string',
        ]);

        // Evita inconsistência: não permitir marcar como LIVRE quando existe uma reserva ativa agora.
        if (array_key_exists('estado', $validated) && mb_strtolower($validated['estado']) === QuartoEstado::LIVRE->value) {
            $now = Carbon::now('UTC');
            $hasReservaAtivaAgora = Reserva::where('quarto_id', $quarto->id)
                ->where('estado', '!=', ReservaEstado::CANCELADO->value)
                ->where('data_inicio', '<=', $now)
                ->where('data_fim', '>', $now)
                ->exists();

            if ($hasReservaAtivaAgora) {
                return response()->json([
                    'message' => 'Não é possível marcar como livre: existe uma reserva ativa neste momento.',
                ], 422);
            }
        }

        $quarto->update($validated);

        return response()->json([
            'message' => 'Quarto editado com sucesso!',
            'data' => $quarto->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quarto $quarto)
    {
        $quarto->delete();
        return response()->json([
            'message' => 'Quarto eliminado com sucesso',
        ]);
    }
}
