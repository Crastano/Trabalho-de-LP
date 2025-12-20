<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Return only current user's reservations
        $userId = $request->user()->id;
        return Reserva::where('utilizador_id', $userId)
            ->with(['quarto', 'pagamento'])
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quarto_id' => 'required|exists:quartos,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
        ]);

        // Add user ID and default estado
        $validated['utilizador_id'] = $request->user()->id;
        $validated['estado'] = 'confirmada';

        Reserva::create($validated);

        return response()->json([
            'message' => 'Reserva criada com sucesso!',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        return $reserva;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reserva $reserva)
    {
        $validated = $request->validate([
            'quarto_id' => 'exists:quartos,id',
            'data_checkin' => 'date',
            'data_checkout' => 'date|after:data_checkin',
        ]);

        $reserva->update($validated);

        return response()->json([
            'message' => 'Reserva editado com sucesso!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        $reserva->delete();
        return response()->json(['message' => 'Reserva eliminada com sucesso']);
    }
}
