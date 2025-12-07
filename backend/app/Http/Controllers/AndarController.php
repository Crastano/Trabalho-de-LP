<?php

namespace App\Http\Controllers;

use App\Models\Andar;
use Illuminate\Http\Request;

class AndarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Andar::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string'
        ]);

        Andar::create($request->all());

        return response()->json([
            'message' => 'Andar criado com sucesso!',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Andar $andar)
    {
        return $andar;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Andar $andar)
    {
        $request->validate([
            'label' => 'string',
        ]);

        $andar->update($request->all());

        return response()->json([
            'message' => 'Andar editado com sucesso!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Andar $andar)
    {
        $andar->delete();
        return response()->json(['message' => 'Andar eliminado']);
    }
}
