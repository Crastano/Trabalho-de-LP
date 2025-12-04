<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UtilizadorController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\QuartoController;
use App\Http\Controllers\AndarController;
use App\Http\Controllers\MapaController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'cargo:Cliente'])->group(function () {
    Route::apiResource('reservas', ReservaController::class);
    Route::apiResource('pagamentos', PagamentoController::class);
});

Route::middleware(['auth:sanctum', 'cargo:Administrador'])->group(function () {
    Route::apiResource('utilizadores', UtilizadorController::class);
    Route::apiResource('quartos', QuartoController::class);
    Route::apiResource('andares', AndarController::class);
});