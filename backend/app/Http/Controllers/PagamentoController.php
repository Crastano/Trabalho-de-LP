<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pagamento::with('reserva')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'valor' => 'required|numeric',
            'metodo' => 'required',
            'pago_em' => 'nullable|date',
            'status' => 'required',
        ]);

        Pagamento::create($validated);

        return response()->json([
            'message' => 'Pagamento criado com sucesso!',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pagamento $pagamento)
    {
        return $pagamento;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pagamento $pagamento)
    {
        $validated = $request->validate([
            'valor' => 'numeric',
            'pago_em' => 'date',
        ]);

        $pagamento->update($validated);

        return response()->json([
            'message' => 'Pagamento editado com sucesso!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pagamento $pagamento)
    {
        $pagamento->delete();
        return response()->json(['message' => 'Pagamento eliminado com sucesso']);
    }
}
