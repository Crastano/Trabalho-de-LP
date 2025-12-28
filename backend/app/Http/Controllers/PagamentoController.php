<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use App\Enums\PagamentoEstado;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;

class PagamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pagamento::query()
            ->with(['reserva', 'reserva.utilizador', 'reserva.quarto'])
            ->orderByDesc('id')
            ->get();
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
            'estado' => ['required', 'string', Rule::in(array_map(fn($c) => $c->value, PagamentoEstado::cases()))],
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
        return $pagamento->load(['reserva', 'reserva.utilizador', 'reserva.quarto']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pagamento $pagamento)
    {
        $validated = $request->validate([
            'valor' => 'numeric',
            'pago_em' => 'date',
            'metodo' => 'sometimes|string',
            'estado' => ['sometimes', 'string', Rule::in(array_map(fn($c) => $c->value, PagamentoEstado::cases()))],
        ]);

        $pagamento->update($validated);

        return response()->json([
            'message' => 'Pagamento editado com sucesso!',
        ]);
    }

    /**
     * Gera uma fatura em PDF para um pagamento.
     */
    public function fatura(Pagamento $pagamento)
    {
        $pagamento->load(['reserva', 'reserva.utilizador', 'reserva.quarto']);

        $pdf = Pdf::loadView('invoices.pagamento', [
            'pagamento' => $pagamento,
            'reserva' => $pagamento->reserva,
            'cliente' => $pagamento->reserva?->utilizador,
            'quarto' => $pagamento->reserva?->quarto,
        ])->setPaper('a4');

        $filename = 'fatura_pagamento_' . $pagamento->id . '.pdf';
        return $pdf->download($filename);
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
