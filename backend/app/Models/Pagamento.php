<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\PagamentoEstado;

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
