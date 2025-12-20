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
        
        // Image URLs for different room types
        $imagemUrls = [
            'Padrão' => [
                'https://images.unsplash.com/photo-1611432591437-7bc62712a4fd?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1537457985112-37bbd6a0d4e1?ixlib=rb-4.0.3&w=600',
            ],
            'Executivo' => [
                'https://images.unsplash.com/photo-1520206183501-b80cf40f0b74?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1578926078328-123456789012?ixlib=rb-4.0.3&w=600',
            ],
            'Luxo' => [
                'https://images.unsplash.com/photo-1564078516801-18f585a1ced3?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&w=600',
                'https://images.unsplash.com/photo-1578926078328-123456789013?ixlib=rb-4.0.3&w=600',
            ],
        ];
        
        $tipoValue = $tipo->value;
        $imagem = $this->faker->randomElement($imagemUrls[$tipoValue] ?? $imagemUrls['Padrão']);

        return [
            'numero' => $numero,
            'andar_id' => $andar,
            'tipo' => $tipo,
            'estado' => QuartoEstado::LIVRE,
            'capacidade' => $this->faker->numberBetween(1, 4),
            'preco_por_dia' => $preco,
            'imagem' => $imagem,
            'posicao_x' => null,
            'posicao_y' => null,
            'destaque' => $this->faker->boolean(30),
        ];
    }
}
