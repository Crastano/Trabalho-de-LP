<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UtilizadorCargo;

class IsAdministrador
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || ($user->cargo ?? null) !== UtilizadorCargo::ADMINISTRADOR->value) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        return $next($request);
    }
}
