<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\PagamentoEstado;
use App\Models\Reserva;
use App\Enums\ReservaEstado;
use Carbon\Carbon;

use function Symfony\Component\Clock\now;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pagamento>
 */
class PagamentoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reserva = Reserva::where('estado', ReservaEstado::CONFIRMADO)->inRandomOrder()->first();

        if (!$reserva) {
            return [];
        }

        $inicio = Carbon::parse($reserva->data_inicio);
        $fim = Carbon::parse($reserva->data_fim);
        $dias = $inicio->diffInDays($fim);
        $valor = $dias * $reserva->quarto->preco_por_dia;

        return [
            'reserva_id' => $reserva->id,
            'valor' => $valor,
            'metodo' => $this->faker->randomElement(['Cartão', 'MBWay', 'Tranferência']),
            'pago_em' => now(),
            'estado' => PagamentoEstado::PAGO,
        ];
    }
}
