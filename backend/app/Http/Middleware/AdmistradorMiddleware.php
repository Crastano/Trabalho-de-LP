<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UtilizadorCargo;

class AdmistradorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        if ($user->cargo !== UtilizadorCargo::ADMINISTRADOR) {
            return response()->json(['message' => 'Acesso permitido apenas a administradores'], 403);
        }

        return $next($request);
    }
}
