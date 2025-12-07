<?php

namespace App\Enums;

enum PagamentoEstado: string
{
    case PENDENTE = 'pendente';
    case PAGO = 'pago';
    case REEMBOLSADO = 'reembolsado';
}
