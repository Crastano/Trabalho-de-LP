<?php

namespace App\Enums;

enum ReservaEstado: string
{
    case PENDENTE = 'pendente';
    case CONFIRMADO = 'confirmado';
    case CANCELADO = 'cancelado';
    case CHECKED_IN = 'checkedin';
    case CHECKED_OUT = 'checkedout';

    public function label(): string
    {
        return match ($this) {
            self::PENDENTE => 'Pendente',
            self::CONFIRMADO => 'Confirmado',
            self::CANCELADO => 'Cancelado',
            self::CHECKED_IN => 'Check-In',
            self::CHECKED_OUT => 'Check-Out',
        };
    }
}
