<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\UtilizadorCargo;

class Utilizador extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'password_hash',
        'cargo',
    ];

    protected $casts = [
        'cargo' => UtilizadorCargo::class,
    ];

    public function reservas() 
    {
        return $this->hasMany(Reserva::class);
    }
}
