<?php

namespace App\Enums;

enum ReservaEstado: string
{
    case PENDENTE = 'pendente';
    case CONFIRMADO = 'confirmado';
    case CANCELADO = 'cancelado';
    case CHECKED_IN = 'checkedin';
    case CHECKED_OUT = 'checkedout';
}