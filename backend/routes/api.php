<?php

use App\Http\Controllers\AndarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authcontroller\AuthController;
use App\Http\Controllers\QuartoController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PagamentoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/registar', [AuthController::class, 'registar']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/quartos', [QuartoController::class, 'index']);
    Route::get('/quartos/{id}', [QuartoController::class, 'show']);

    Route::get('/andares', [AndarController::class, 'index']);
    Route::get('/andares/{id}', [AndarController::class, 'show']);

    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::get('/reservas/{id}', [ReservaController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'administrador'])->group(function () {

    // QUARTOS
    Route::post('/quartos', [QuartoController::class, 'store']);
    Route::put('/quartos/{id}', [QuartoController::class, 'update']);
    Route::delete('/quartos/{id}', [QuartoController::class, 'destroy']);

    // ANDARES
    Route::post('/andares', [AndarController::class, 'store']);
    Route::put('/andares/{id}', [AndarController::class, 'update']);
    Route::delete('/andares/{id}', [AndarController::class, 'destroy']);

    // RESERVAS
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::put('/reservas/{id}', [ReservaController::class, 'update']);
    Route::delete('/reservas/{id}', [ReservaController::class, 'destroy']);

    // PAGAMENTOS
    Route::post('/pagamentos', [PagamentoController::class, 'store']);
    Route::put('/pagamentos/{id}', [PagamentoController::class, 'update']);
    Route::delete('/pagamentos/{id}', [PagamentoController::class, 'destroy']);
});
