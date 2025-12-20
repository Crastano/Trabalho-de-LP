<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\QuartoEstado;
use App\Enums\QuartoTipo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quarto extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'andar_id',
        'tipo',
        'capacidade',
        'estado',
        'preco_por_dia',
        'posicao_x',
        'posicao_y',
        'imagem',
        'destaque',
        'camas',
        'wifi',
        'ar_condicionado',
        'tv',
        'descricao',
    ];

    protected $casts = [
        'tipo' => QuartoTipo::class,
        'estado' => QuartoEstado::class,
        'destaque' => 'boolean',
        'wifi' => 'boolean',
        'ar_condicionado' => 'boolean',
        'tv' => 'boolean',
    ];

    public function andar() {
        return $this->belongsTo(Andar::class);
    }

    public function reservas() {
        return $this->hasMany(Reserva::class);
    }
}
