<?php

namespace Database\Seeders;

use App\Enums\UtilizadorCargo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Enums\UtilzizadorCargo;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->administrador()->create();
        User::factory(9)->create();
    }
}
