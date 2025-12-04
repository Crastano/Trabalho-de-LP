<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\QuartoEstado;
use App\Enums\QuartoTipo;

class Quarto extends Model
{
    use HasFactory;

    protected $fillable = [
        'andar_id',
        'tipo',
        'capacidade',
        'estado',
        'preco_por_dia',
        'posicao_x',
        'prosicao_y',
    ];

    protected $casts = [
        'tipo' => QuartoTipo::class,
        'estado' => QuartoEstado::class,
    ];

    public function andar() {
        return $this->belongsTo(Andar::class);
    }

    public function reservas() {
        return $this->hasMany(Reserva::class);
    }
}
