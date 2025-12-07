<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Reserva::with(['utilizador', 'quarto', 'pagamento'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'utilizador_id' => 'required|exists:utilizadors,id',
            'quarto_id' => 'required|exists:quartos,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_checkin',
            'estado' => 'required',
        ]);

        Reserva::create($validated);

        return response()->json([
            'message' => 'Reserva criado com sucesso!',
        ]);
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
