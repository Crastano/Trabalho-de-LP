<?php

namespace App\Mail;

use App\Models\Reserva;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReservaConfirmacaoMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Reserva $reserva)
    {
        // Garantir que relações essenciais existem quando o Job correr.
        $this->reserva->loadMissing(['quarto', 'pagamento', 'utilizador']);
    }

    public function envelope(): Envelope
    {
        $numero = $this->reserva->id;
        $quartoNumero = $this->reserva->quarto?->numero ?? $this->reserva->quarto_id;

        return new Envelope(
            subject: "Confirmação da Reserva #{$numero} (Quarto {$quartoNumero})",
        );
    }

    public function content(): Content
    {
        $inicio = $this->toDate($this->reserva->data_inicio);
        $fim = $this->toDate($this->reserva->data_fim);
        $noites = $this->nights($inicio, $fim);

        $precoDia = (float) ($this->reserva->quarto?->preco_por_dia ?? 0);
        $total = $this->reserva->pagamento?->valor ?? ($precoDia * $noites);

        return new Content(
            view: 'emails.reserva_confirmacao',
            with: [
                'reserva' => $this->reserva,
                'inicio' => $inicio,
                'fim' => $fim,
                'noites' => $noites,
                'precoDia' => $precoDia,
                'total' => (float) $total,
            ],
        );
    }

    /**
     * Envia também um PDF de comprovativo/anexo.
     */
    public function attachments(): array
    {
        $reservaId = $this->reserva->id;

        return [
            Attachment::fromData(function () {
                $inicio = $this->toDate($this->reserva->data_inicio);
                $fim = $this->toDate($this->reserva->data_fim);
                $noites = $this->nights($inicio, $fim);
                $precoDia = (float) ($this->reserva->quarto?->preco_por_dia ?? 0);
                $total = $this->reserva->pagamento?->valor ?? ($precoDia * $noites);

                return Pdf::loadView('pdf.reserva_comprovativo', [
                    'reserva' => $this->reserva,
                    'inicio' => $inicio,
                    'fim' => $fim,
                    'noites' => $noites,
                    'precoDia' => $precoDia,
                    'total' => (float) $total,
                ])->output();
            }, "comprovativo-reserva-{$reservaId}.pdf")
                ->withMime('application/pdf'),
        ];
    }

    private function toDate(mixed $value): ?Carbon
    {
        try {
            if ($value instanceof Carbon) return $value;
            if ($value instanceof \DateTimeInterface) return Carbon::instance($value);
            if (is_string($value) && $value !== '') return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }

        return null;
    }

    private function nights(?Carbon $start, ?Carbon $end): int
    {
        if (!$start || !$end) return 1;
        $d = $start->copy()->startOfDay()->diffInDays($end->copy()->startOfDay());
        return max(1, (int) $d);
    }
}
