<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <style>
    * { font-family: DejaVu Sans, Arial, sans-serif; }
    body { font-size: 12px; color: #111827; }
    .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 14px; }
    .brand { font-size: 18px; font-weight: 800; color: #1e3a8a; }
    .muted { color: #6b7280; }
    .grid { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .grid td { padding: 10px; border: 1px solid #e5e7eb; }
    .k { width: 34%; background: #f9fafb; font-weight: 700; color:#374151; }
    .v { font-weight: 700; }
    .big { font-size: 14px; font-weight: 900; }
    .footer { margin-top: 18px; font-size: 11px; color:#6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">MapHotel</div>
    <div class="muted">Comprovativo de Reserva</div>
  </div>

  <table class="grid">
    <tr>
      <td class="k">Nº da reserva</td>
      <td class="v">#{{ $reserva->id }}</td>
    </tr>
    <tr>
      <td class="k">Cliente</td>
      <td class="v">{{ $reserva->utilizador->name ?? '-' }} ({{ $reserva->utilizador->email ?? '-' }})</td>
    </tr>
    <tr>
      <td class="k">Quarto</td>
      <td class="v">{{ $reserva->quarto->nome ?? 'Quarto' }} (nº {{ $reserva->quarto->numero ?? $reserva->quarto_id }})</td>
    </tr>
    <tr>
      <td class="k">Check-in</td>
      <td class="v">{{ $inicio ? $inicio->format('d/m/Y') : ($reserva->data_inicio ?? '-') }}</td>
    </tr>
    <tr>
      <td class="k">Check-out</td>
      <td class="v">{{ $fim ? $fim->format('d/m/Y') : ($reserva->data_fim ?? '-') }}</td>
    </tr>
    <tr>
      <td class="k">Noites</td>
      <td class="v">{{ $noites }}</td>
    </tr>
    <tr>
      <td class="k">Estado</td>
      <td class="v">{{ is_object($reserva->estado) ? $reserva->estado->value : ($reserva->estado ?? '-') }}</td>
    </tr>
    <tr>
      <td class="k">Preço por dia</td>
      <td class="v">€ {{ number_format($precoDia, 2, ',', '.') }}</td>
    </tr>
    <tr>
      <td class="k">Total</td>
      <td class="v big">€ {{ number_format($total, 2, ',', '.') }}</td>
    </tr>
  </table>

  <div class="footer">
    Documento gerado automaticamente em {{ now()->format('d/m/Y H:i') }}.
  </div>
</body>
</html>
