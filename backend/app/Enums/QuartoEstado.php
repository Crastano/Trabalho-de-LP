<?php

namespace App\Enums;

enum QuartoEstado: string
{
    case LIVRE = 'livre';
    case OCUPADO = 'ocupado';

    public function label(): string
    {
        return match ($this) {
            self::LIVRE => 'Livre',
            self::OCUPADO => 'Ocupado',
        };
    }
}
