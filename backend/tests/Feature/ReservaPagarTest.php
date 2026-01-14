<?php

use App\Models\Andar;
use App\Models\Quarto;
use App\Models\User;
use App\Enums\QuartoEstado;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;

it('allows a cliente to confirm payment for their own reserva', function () {
    Mail::fake();

    $user = User::factory()->create([
        'cargo' => 'cliente',
    ]);

    $andar = Andar::factory()->create();

    $quarto = Quarto::factory()->create([
        'andar_id' => $andar->id,
        'preco_por_dia' => 100,
        'estado' => QuartoEstado::LIVRE,
    ]);

    Sanctum::actingAs($user);

    $resp = $this->postJson('/api/reservas', [
        'quarto_id' => $quarto->id,
        'data_entrada' => now()->addDays(5)->toDateString(),
        'data_saida' => now()->addDays(7)->toDateString(),
        'metodo_pagamento' => 'mbway',
    ]);

    $resp->assertStatus(201);

    $reservaId = $resp->json('data.id');
    expect($reservaId)->not->toBeNull();

    $reserva = $resp->json('data');
    expect(data_get($reserva, 'pagamento.estado'))->toBe('pendente');

    $pay = $this->postJson("/api/reservas/{$reservaId}/pagar", [
        'metodo' => 'mbway',
        'telefone' => '912345678',
    ]);

    $pay->assertOk();
    expect($pay->json('data.pagamento.estado'))->toBe('pago');
});
