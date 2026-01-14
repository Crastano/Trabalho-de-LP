<?php

use App\Http\Controllers\AndarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authcontroller\AuthController;
use App\Http\Controllers\QuartoController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;

Route::post('/registar', [AuthController::class, 'registar']);
Route::post('/login', [AuthController::class, 'login']);

// Reset password (público)
Route::post('/forgot-password', [PasswordResetController::class, 'forgot']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Quartos públicos (sem autenticação)
Route::get('/quartos', [QuartoController::class, 'index']);
Route::get('/quartos/disponibilidade', [QuartoController::class, 'disponibilidade']);
Route::get('/quartos/{quarto}', [QuartoController::class, 'show']);

Route::middleware(['auth:sanctum', 'ativo'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user', [ProfileController::class, 'update']);
    Route::put('/user/password', [ProfileController::class, 'updatePassword']);

    Route::get('/andares', [AndarController::class, 'index']);
    Route::get('/andares/{andar}', [AndarController::class, 'show']);

    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::get('/reservas/{reserva}', [ReservaController::class, 'show']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::post('/reservas/{reserva}/pagar', [ReservaController::class, 'pagar']);
    Route::get('/reservas/{reserva}/fatura', [ReservaController::class, 'fatura']);
    Route::put('/reservas/{reserva}', [ReservaController::class, 'update']);
    Route::delete('/reservas/{reserva}', [ReservaController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'ativo', 'administrador'])->group(function () {

    // CLIENTES
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{user}', [ClienteController::class, 'show']);
    Route::put('/clientes/{user}', [ClienteController::class, 'update']);

    // QUARTOS
    Route::post('/quartos', [QuartoController::class, 'store']);
    Route::put('/quartos/{quarto}', [QuartoController::class, 'update']);
    Route::delete('/quartos/{quarto}', [QuartoController::class, 'destroy']);

    // ANDARES
    Route::post('/andares', [AndarController::class, 'store']);
    Route::put('/andares/{andar}', [AndarController::class, 'update']);
    Route::delete('/andares/{andar}', [AndarController::class, 'destroy']);

    // PAGAMENTOS
    Route::get('/pagamentos', [PagamentoController::class, 'index']);
    Route::get('/pagamentos/{pagamento}', [PagamentoController::class, 'show']);
    Route::get('/pagamentos/{pagamento}/fatura', [PagamentoController::class, 'fatura']);
    Route::post('/pagamentos', [PagamentoController::class, 'store']);
    Route::put('/pagamentos/{pagamento}', [PagamentoController::class, 'update']);
    Route::delete('/pagamentos/{pagamento}', [PagamentoController::class, 'destroy']);
});
