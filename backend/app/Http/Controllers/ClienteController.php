<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->where('cargo', 'cliente');

        if ($request->filled('q')) {
            $q = trim((string) $request->get('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $clientes = $query
            ->withCount('reserva as reservas_count')
            ->withMax('reserva as ultima_reserva', 'data_inicio')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'ativo', 'created_at']);

        return response()->json($clientes);
    }

    public function show(User $user)
    {
        if ($user->cargo !== 'cliente') {
            return response()->json(['message' => 'Utilizador inválido'], 404);
        }

        $user->loadCount('reserva as reservas_count');
        $user->loadMax('reserva as ultima_reserva', 'data_inicio');

        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        if ($user->cargo !== 'cliente') {
            return response()->json(['message' => 'Utilizador inválido'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'ativo' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        // Se desativar, revoga tokens para cortar sessão imediatamente.
        if (array_key_exists('ativo', $validated) && $validated['ativo'] === false) {
            $user->tokens()->delete();
        }

        $user->loadCount('reserva as reservas_count');
        $user->loadMax('reserva as ultima_reserva', 'data_inicio');

        return response()->json([
            'message' => 'Cliente atualizado com sucesso!',
            'data' => $user,
        ]);
    }
}
