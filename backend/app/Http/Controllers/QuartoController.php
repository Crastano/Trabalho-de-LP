<?php

namespace App\Http\Controllers;

use App\Models\Quarto;
use Illuminate\Http\Request;

class QuartoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Quarto::orderBy('numero', 'asc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|integer',
            'andar_id' => 'required|exists:andars,id',
            'tipo' => 'required|string',
            'capacidade' => 'required|integer',
            'estado' => 'required|string',
            'preco_por_dia' => 'required|numeric',
        ]);

        Quarto::create($validated);

        return response()->json([
            'message' => 'Quarto criado com sucesso!',
        ]);
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
            'tipo' => 'string',
            'capacidade' => 'integer',
            'estado' => 'string',
            'preco_por_dia' => 'numeric',
            'posicao_x' => 'integer',
            'posicao_y' => 'integer',
        ]);

        $quarto->update($validated);

        return response()->json([
            'message' => 'Quarto editado com sucesso!',
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
