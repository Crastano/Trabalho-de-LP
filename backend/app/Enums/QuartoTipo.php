<?php

namespace App\Enums;

enum QuartoTipo: string
{
    case PADRAO = 'padrao';
    case EXECUTIVO = 'executivo';
    case LUXO = 'luxo';

    public function descricao(): string
    {
        return match ($this) {
            self::PADRAO => 'Padrão',
            self::EXECUTIVO => 'Executivo',
            self::LUXO => 'Luxo',
        };
    }
}
