<?php

namespace App\Http\Controllers;

use App\Models\Quarto;
use App\Enums\QuartoEstado;
use App\Enums\QuartoTipo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
