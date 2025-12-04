<?php

namespace App\Enums;

enum PagamentoEstado: string
{
    case PENDENTE = 'pendente';
    case PAGO = 'pago';
    case REEMBOLSADO = 'reembolsado';

    public function label(): string
    {
        return match ($this) {
            self::PENDENTE => 'Pendente',
            self::PAGO => 'Pago',
            self::REEMBOLSADO => 'Reembolsado',
        };
    }
}
