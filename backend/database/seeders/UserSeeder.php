<?php

namespace Database\Seeders;

use App\Enums\UtilizadorCargo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin fixo para acesso ao painel
        User::updateOrCreate(
            ['email' => 'admin@hotel.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'cargo' => UtilizadorCargo::ADMINISTRADOR,
            ],
        );

        // Clientes de exemplo
        User::factory(9)->create();
    }
}
