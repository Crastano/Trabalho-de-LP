<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\QuartoTipo;
use App\Enums\QuartoEstado;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quarto>
 */
class QuartoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipo = $this->faker->randomElement(QuartoTipo::cases());

        $preco = match ($tipo) {
            QuartoTipo::PADRAO => $this->faker->numberBetween(50, 80),
            QuartoTipo::LUXO => $this->faker->numberBetween(80, 120),
            QuartoTipo::EXECUTIVO => $this->faker->numberBetween(120, 200),
        };

        $andar = rand(1, 4);
        $numero = $andar . rand(10, 20);

        return [
            'numero' => $numero,
            'andar_id' => $andar,
            'tipo' => $tipo,
            'estado' => QuartoEstado::LIVRE,
            'capacidade' => $this->faker->numberBetween(1, 4),
            'preco_por_dia' => $preco,
            'posicao_x' => null,
            'posicao_y' => null,
        ];
    }
}
