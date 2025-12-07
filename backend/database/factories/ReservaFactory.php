<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\ReservaEstado;
use App\Models\Quarto;
use App\Models\Reserva;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reserva>
 */
class ReservaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quarto = Quarto::inRandomOrder()->first();

        do {
            $inicio = Carbon::parse($this->faker->dateTimeBetween('+1 day', '+60 days'));
            $fim = (clone $inicio)->addDays(rand(1, 7));

            $colide = Reserva::existeColisao($quarto->id, $inicio, $fim);
        } while ($colide);

        return [
            'utilizador_id' => rand(2, 10),
            'quarto_id' => $quarto->id,
            'data_inicio' => $inicio,
            'data_fim' => $fim,
            'estado' => $this->faker->randomElement(ReservaEstado::cases()),
        ];
    }
}
