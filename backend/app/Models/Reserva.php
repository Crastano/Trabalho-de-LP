<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ReservaEstado;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'utilizador_id',
        'quarto_id',
        'data_inicio',
        'data_fim',
        'estado',
    ];

    protected $casts = [
        'data_inicio' => 'datetime',
        'data_fim' => 'datetime',
        'estado' => ReservaEstado::class,
    ];

    public function utilizador() {
        return $this->belongsTo(Utilizador::class);
    }

    public function quarto() {
        return $this->hasOne(Quarto::class);
    }

    public function pagamento() {
        return $this->hasOne(Pagamento::class);
    }
}
