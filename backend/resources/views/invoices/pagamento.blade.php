<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fatura</title>
    <style>
      body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .brand { font-size: 18px; font-weight: 700; }
      .muted { color: #6b7280; }
      .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
      .grid { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .grid th, .grid td { border-bottom: 1px solid #e5e7eb; padding: 8px 6px; text-align: left; vertical-align: top; }
      .grid th { color: #374151; font-weight: 700; background: #f9fafb; }
      .right { text-align: right; }
      .row { display: flex; gap: 12px; }
      .col { flex: 1; }
      .mt { margin-top: 12px; }
      .total { font-size: 14px; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">MapHotel</div>
        <div class="muted">Fatura / Recibo</div>
      </div>
      <div class="right">
        <div><strong>Pagamento #{{ $pagamento->id }}</strong></div>
        <div class="muted">Emitido em: {{ now()->format('d/m/Y H:i') }}</div>
      </div>
    </div>

    <div class="row">
      <div class="col box">
        <div><strong>Cliente</strong></div>
        <div>{{ $cliente?->name ?? '-' }}</div>
        <div class="muted">{{ $cliente?->email ?? '' }}</div>
      </div>
      <div class="col box">
        <div><strong>Reserva</strong></div>
        <div>ID: {{ $reserva?->id ?? '-' }}</div>
        <div class="muted">
          Check-in: {{ $reserva?->data_inicio?->format('d/m/Y H:i') ?? '-' }}<br />
          Check-out: {{ $reserva?->data_fim?->format('d/m/Y H:i') ?? '-' }}
        </div>
      </div>
      <div class="col box">
        <div><strong>Quarto</strong></div>
        <div>Nº {{ $quarto?->numero ?? '-' }}</div>
        <div class="muted">Tipo: {{ $quarto?->tipo ?? '-' }}</div>
      </div>
    </div>

    <div class="mt box">
      <table class="grid">
        <thead>
          <tr>
            <th>Descrição</th>
            <th class="right">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Estadia (reserva #{{ $reserva?->id ?? '-' }})</td>
            <td class="right">{{ number_format((float) ($pagamento->valor ?? 0), 2, ',', '.') }} €</td>
          </tr>
        </tbody>
      </table>

      <div class="right mt total">
        Total: {{ number_format((float) ($pagamento->valor ?? 0), 2, ',', '.') }} €
      </div>
      <div class="muted right">
        Estado: {{ $pagamento->estado ?? '-' }} | Método: {{ $pagamento->metodo ?? '-' }}
        @if($pagamento->pago_em)
          | Pago em: {{ $pagamento->pago_em->format('d/m/Y H:i') }}
        @endif
      </div>
    </div>

    <div class="mt muted">
      Documento gerado automaticamente.
    </div>
  </body>
</html>
