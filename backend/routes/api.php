<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UtilizadorController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\QuartoController;
use App\Http\Controllers\AndarController;

// Registar conta
Route::post('/register', [AuthController::class, 'register']);
// Iniciar sessão
Route::post('/login', [AuthController::class, 'login']);

// Rotas comuns para os clientes e administradores
Route::middleware('auth:sanctum')->group(function () {
    // Chamar os dados do utilizador
    Route::get('/user', [AuthController::class, 'user']);
    // Terminar sessão
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Rotas para os clientes
Route::middleware(['auth:sanctum', 'cargo:Cliente'])->group(function () {
    Route::apiResource('reservas', ReservaController::class);
    Route::apiResource('pagamentos', PagamentoController::class);
});

// Rotas para os administradores
Route::middleware(['auth:sanctum', 'cargo:Administrador'])->group(function () {
    Route::apiResource('utilizadores', UtilizadorController::class);
    Route::apiResource('quartos', QuartoController::class);
    Route::apiResource('andares', AndarController::class);
});