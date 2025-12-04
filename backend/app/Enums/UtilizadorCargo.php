<?php

namespace App\Enums;

enum UtilizadorCargo: string
{
    case CLIENTE = 'cliente';
    case ADMINISTRADOR = 'administrador';

    public function label(): string
    {
        return match ($this) {
            self::CLIENTE => 'Cliente',
            self::ADMINISTRADOR => 'Administrador',
        };
    }
}
