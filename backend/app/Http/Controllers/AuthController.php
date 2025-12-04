<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilizador;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registar(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:utilizadors',
            'password_hash' => 'required|min:6',
        ]);

        $utilizador = Utilizador::create([
            'email' => $request->email,
            'password_hash' => Hash::make($request->password_hash),
        ]);

        return response()->json($utilizador, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password_hash' => 'required|min:6',
        ]);

        $utilizador = Utilizador::where('email', $request->email)->first();

        if (!$utilizador || !Hash::check($request->password_hash, $utilizador->password_hash)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = $utilizador->createToken('react-token')->plainTextToken;

        return response()->json(['utilizador' => $utilizador, 'token' => $token]);
    }

    public function user(Request $request)
    {
        return $request->user();
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sessão terminada']);
    }
}