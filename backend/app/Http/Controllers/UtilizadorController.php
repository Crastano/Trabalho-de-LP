<?php

namespace App\Http\Controllers;

use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilizadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Utilizador::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:utilizadors',
            'password_hash' => 'required|min:6',
        ]);

        $validated['password_hash'] = Hash::make($validated['password_hash']);

        return Utilizador::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Utilizador $utilizador)
    {
        return $utilizador;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Utilizador $utilizador)
    {
        $validated = $request->validate([
            'email' => 'email|unique:utilizadors,email,' . $utilizador->id,
        ]);

        if (isset($validated['password_hash'])) {
            $validated['password_hash'] = Hash::make($validated['password_hash']);
        }

        $utilizador->update($validated);

        return $utilizador;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Utilizador $utilizador)
    {
        $utilizador->delete();
        return response()->noContent();
    }
}
