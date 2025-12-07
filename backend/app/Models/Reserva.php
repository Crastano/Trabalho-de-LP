<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\ReservaEstado;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        return $this->belongsTo(User::class);
    }

    public function quarto() {
        return $this->belongsTo(Quarto::class);
    }

    public function pagamento() {
        return $this->hasOne(Pagamento::class);
    }

    public static function existeColisao($quartoId, $dataInicio, $dataFim, $ignorarId = null)
    {
        // Buscar reservas do mesmo quarto (criada por ChatGPT)
        return self::where('quarto_id', $quartoId)

            // Se estiver a atualizar uma reserva, ignorar ela própria
            ->when($ignorarId, function ($query) use ($ignorarId) {
                $query->where('id', '!=', $ignorarId);
            })

            // Verificar se existe ALGUMA reserva que se sobreponha
            ->where(function ($query) use ($dataInicio, $dataFim) {
                $query->where('data_inicio', '<', $dataFim)   // começa antes de terminar
                    ->where('data_fim',    '>', $dataInicio); // termina depois de começar
            })

            // Basta existir 1 overlapping → colisão verdadeira
            ->exists();
    }
}
