<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAtivo
{
    /**
     * Bloqueia utilizadores inativos (exceto administradores).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->cargo ?? null) !== 'administrador' && ($user->ativo ?? true) === false) {
            return response()->json(['message' => 'Conta inativa'], 403);
        }

        return $next($request);
    }
}
