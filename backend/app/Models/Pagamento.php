<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\PagamentoEstado;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pagamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'reserva_id',
        'valor',
        'metodo',
        'pago_em',
        'estado',
    ];

    protected $casts = [
        'pago_em' => 'datetime',
        'estado' => PagamentoEstado::class,
    ];

    public function reserva() {
        return $this->belongsTo(Reserva::class);
    }
}
