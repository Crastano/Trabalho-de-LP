<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirmação de Reserva</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Segoe UI,Arial,sans-serif;color:#111827;">
  <div style="max-width:680px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(2,6,23,.08)">
      <div style="padding:18px 20px;background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff;">
        <div style="font-size:18px;font-weight:800;letter-spacing:-.2px;">MapHotel</div>
        <div style="margin-top:6px;font-size:14px;opacity:.95;">Confirmação da sua reserva</div>
      </div>

      <div style="padding:20px;">
        <p style="margin:0 0 10px 0;font-size:14px;">Olá <strong>{{ $reserva->utilizador->name ?? 'Cliente' }}</strong>,</p>
        <p style="margin:0 0 16px 0;font-size:14px;line-height:1.55;color:#374151;">
          A sua reserva foi registada com sucesso. Em anexo segue o comprovativo em PDF.
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:12px;margin:14px 0 18px;">
          <div style="flex:1;min-width:240px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:12px;">
            <div style="font-size:12px;color:#6b7280;font-weight:700;">Nº da reserva</div>
            <div style="font-size:16px;font-weight:900;color:#0f172a;">#{{ $reserva->id }}</div>
          </div>
          <div style="flex:1;min-width:240px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:12px;">
            <div style="font-size:12px;color:#6b7280;font-weight:700;">Estado</div>
            <div style="font-size:16px;font-weight:900;color:#0f172a;">{{ is_object($reserva->estado) ? $reserva->estado->value : ($reserva->estado ?? '-') }}</div>
          </div>
        </div>

        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
          <tbody>
            <tr>
              <td style="padding:12px 14px;font-size:13px;color:#6b7280;font-weight:700;background:#f9fafb;width:42%;">Quarto</td>
              <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:800;">{{ $reserva->quarto->nome ?? 'Quarto' }} (nº {{ $reserva->quarto->numero ?? $reserva->quarto_id }})</td>
            </tr>
            <tr>
              <td style="padding:12px 14px;font-size:13px;color:#6b7280;font-weight:700;background:#f9fafb;">Check-in</td>
              <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:700;">{{ $inicio ? $inicio->format('d/m/Y') : ($reserva->data_inicio ?? '-') }}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px;font-size:13px;color:#6b7280;font-weight:700;background:#f9fafb;">Check-out</td>
              <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:700;">{{ $fim ? $fim->format('d/m/Y') : ($reserva->data_fim ?? '-') }}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px;font-size:13px;color:#6b7280;font-weight:700;background:#f9fafb;">Noites</td>
              <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:700;">{{ $noites }}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px;font-size:13px;color:#6b7280;font-weight:700;background:#f9fafb;">Total estimado</td>
              <td style="padding:12px 14px;font-size:13px;color:#111827;font-weight:900;">€ {{ number_format($total, 2, ',', '.') }}</td>
            </tr>
          </tbody>
        </table>

        <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;line-height:1.6;">
          Se precisar de ajuda, responda a este email ou contacte-nos.
        </p>
      </div>

      <div style="padding:14px 20px;border-top:1px solid #e5e7eb;background:#f9fafb;font-size:12px;color:#6b7280;">
        <div style="font-weight:700;color:#374151;">MapHotel</div>
        <div>Este é um email automático. Guarde o comprovativo em anexo.</div>
      </div>
    </div>
  </div>
</body>
</html>
