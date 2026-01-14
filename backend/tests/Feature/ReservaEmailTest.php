<?php

use App\Mail\ReservaConfirmacaoMail;
use App\Models\Andar;
use App\Models\Quarto;
use App\Models\User;
use App\Enums\QuartoEstado;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;

it('queues a confirmation email when a reservation is created', function () {
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

    $payload = [
        'quarto_id' => $quarto->id,
        'data_inicio' => now()->addDays(3)->toDateString(),
        'data_fim' => now()->addDays(5)->toDateString(),
        'metodo_pagamento' => 'mbway',
    ];

    $this->postJson('/api/reservas', $payload)
        ->assertStatus(201);

    Mail::assertQueued(ReservaConfirmacaoMail::class);
});
