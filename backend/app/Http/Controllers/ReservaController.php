<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Pagamento;
use App\Models\Quarto;
use App\Mail\ReservaConfirmacaoMail;
use App\Enums\ReservaEstado;
use App\Enums\PagamentoEstado;
use App\Enums\UtilizadorCargo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReservaController extends Controller
{
    private function assertCanAccessReserva(Request $request, Reserva $reserva): void
    {
        $user = $request->user();
        $isAdmin = ($user->cargo ?? null) === UtilizadorCargo::ADMINISTRADOR->value;

        if (!$isAdmin && (int) $reserva->utilizador_id !== (int) $user->id) {
            abort(403, 'Não tem permissões para aceder a esta reserva.');
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Reserva::query()->with(['quarto', 'pagamento', 'utilizador'])->orderBy('data_inicio', 'desc');

        // Admin vê todas; cliente vê só as suas
        if (($user->cargo ?? null) !== UtilizadorCargo::ADMINISTRADOR->value) {
            $query->where('utilizador_id', $user->id);
        }

        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Normaliza nomes vindos do frontend (algumas páginas usam data_entrada/data_saida)
        $payload = $request->all();
        $payload['data_inicio'] = $payload['data_inicio'] ?? $payload['data_entrada'] ?? $payload['data_checkin'] ?? null;
        $payload['data_fim'] = $payload['data_fim'] ?? $payload['data_saida'] ?? $payload['data_checkout'] ?? null;
        $payload['metodo_pagamento'] = $payload['metodo_pagamento'] ?? $payload['metodo'] ?? null;

        $user = $request->user();
        $isAdmin = ($user->cargo ?? null) === UtilizadorCargo::ADMINISTRADOR->value;

        $validated = validator($payload, [
            'quarto_id' => 'required|exists:quartos,id',
            'data_inicio' => 'required|date|after_or_equal:today',
            'data_fim' => 'required|date|after:data_inicio',
            // Admin pode criar para outro utilizador, mas se não enviar usamos o próprio.
            'utilizador_id' => $isAdmin ? 'sometimes|exists:users,id' : 'prohibited',
            'estado' => ['sometimes', 'string', Rule::in(array_map(fn($c) => $c->value, ReservaEstado::cases()))],
            'metodo_pagamento' => 'sometimes|nullable|string|max:50',
        ])->validate();

        // Previne sobreposição de reservas no mesmo quarto
        if (Reserva::existeColisao($validated['quarto_id'], $validated['data_inicio'], $validated['data_fim'])) {
            return response()->json([
                'message' => 'Já existe uma reserva para esse quarto nesse período.',
            ], 422);
        }

        $validated['utilizador_id'] = $isAdmin ? ($validated['utilizador_id'] ?? $user->id) : $user->id;
        $validated['estado'] = $validated['estado'] ?? ReservaEstado::CONFIRMADO->value;

        $metodoPagamento = $validated['metodo_pagamento'] ?? null;
        unset($validated['metodo_pagamento']);

        $reserva = Reserva::create($validated);

        // Cria um pagamento pendente quando o cliente escolhe método.
        if ($metodoPagamento) {
            $quarto = Quarto::find($reserva->quarto_id);
            $precoDia = (float) ($quarto?->preco_por_dia ?? 0);

            $inicio = Carbon::parse($reserva->data_inicio);
            $fim = Carbon::parse($reserva->data_fim);
            $noites = max(1, $inicio->diffInDays($fim));

            Pagamento::create([
                'reserva_id' => $reserva->id,
                'valor' => $precoDia * $noites,
                'metodo' => $metodoPagamento,
                'estado' => PagamentoEstado::PENDENTE->value,
            ]);
        }

        $reserva->load(['quarto', 'pagamento', 'utilizador']);

        // Envio de confirmação por email (com comprovativo PDF) para o cliente.
        // Não deve bloquear a criação da reserva caso haja erro no email.
        try {
            $email = $reserva->utilizador?->email;
            if ($email) {
                Mail::to($email)->queue(new ReservaConfirmacaoMail($reserva));
            }
        } catch (\Throwable $e) {
            Log::warning('Falha ao enviar email de confirmação de reserva', [
                'reserva_id' => $reserva->id,
                'user_id' => $reserva->utilizador_id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Reserva criada com sucesso!',
            'data' => $reserva,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserva $reserva)
    {
        $this->assertCanAccessReserva(request(), $reserva);
        return $reserva->load(['quarto', 'pagamento', 'utilizador']);
    }

    /**
     * Confirma (simula) o pagamento de uma reserva do cliente.
     */
    public function pagar(Request $request, Reserva $reserva)
    {
        $this->assertCanAccessReserva($request, $reserva);

        $reserva->load(['pagamento', 'quarto', 'utilizador']);
        $pagamento = $reserva->pagamento;

        if (!$pagamento) {
            return response()->json([
                'message' => 'Esta reserva não tem pagamento associado.',
            ], 422);
        }

        // (Opcional) valida dados do "checkout" (fluxo simulado)
        $validated = $request->validate([
            'metodo' => 'sometimes|string|max:50',
            'telefone' => 'sometimes|nullable|string|max:50',
            'cartao_numero' => 'sometimes|nullable|string|max:30',
            'cartao_validade' => 'sometimes|nullable|string|max:10',
            'cartao_cvc' => 'sometimes|nullable|string|max:10',
        ]);

        if (isset($validated['metodo']) && $validated['metodo'] !== $pagamento->metodo) {
            return response()->json([
                'message' => 'Método de pagamento inválido para esta reserva.',
            ], 422);
        }

        if (($pagamento->estado ?? null) === PagamentoEstado::PAGO->value) {
            return response()->json([
                'message' => 'Pagamento já se encontra confirmado.',
                'data' => $reserva->fresh()->load(['quarto', 'pagamento', 'utilizador']),
            ]);
        }

        $pagamento->update([
            'estado' => PagamentoEstado::PAGO->value,
            'pago_em' => now(),
        ]);

        return response()->json([
            'message' => 'Pagamento confirmado com sucesso!',
            'data' => $reserva->fresh()->load(['quarto', 'pagamento', 'utilizador']),
        ]);
    }

    /**
     * Gera a fatura (PDF) do pagamento associado à reserva (cliente só pode ver as suas).
     */
    public function fatura(Request $request, Reserva $reserva)
    {
        $this->assertCanAccessReserva($request, $reserva);

        $reserva->load(['pagamento', 'quarto', 'utilizador']);
        $pagamento = $reserva->pagamento;

        if (!$pagamento) {
            return response()->json([
                'message' => 'Esta reserva não tem pagamento associado.',
            ], 422);
        }

        if (($pagamento->estado ?? null) !== PagamentoEstado::PAGO->value) {
            return response()->json([
                'message' => 'A fatura só fica disponível após o pagamento estar confirmado.',
            ], 422);
        }

        $pdf = Pdf::loadView('invoices.pagamento', [
            'pagamento' => $pagamento,
            'reserva' => $reserva,
            'cliente' => $reserva->utilizador,
            'quarto' => $reserva->quarto,
        ])->setPaper('a4');

        $filename = 'fatura_pagamento_' . $pagamento->id . '.pdf';
        return $pdf->download($filename);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reserva $reserva)
    {
        $this->assertCanAccessReserva($request, $reserva);
        $payload = $request->all();
        $payload['data_inicio'] = $payload['data_inicio'] ?? $payload['data_entrada'] ?? $payload['data_checkin'] ?? null;
        $payload['data_fim'] = $payload['data_fim'] ?? $payload['data_saida'] ?? $payload['data_checkout'] ?? null;

        $validated = validator($payload, [
            'quarto_id' => 'sometimes|exists:quartos,id',
            'data_inicio' => 'sometimes|date|after_or_equal:today',
            'data_fim' => 'sometimes|date|after:data_inicio',
            'estado' => ['sometimes', 'string', Rule::in(array_map(fn($c) => $c->value, ReservaEstado::cases()))],
        ])->validate();

        $novoQuartoId = $validated['quarto_id'] ?? $reserva->quarto_id;
        $novoInicio = $validated['data_inicio'] ?? $reserva->data_inicio;
        $novoFim = $validated['data_fim'] ?? $reserva->data_fim;

        if (array_key_exists('quarto_id', $validated) || array_key_exists('data_inicio', $validated) || array_key_exists('data_fim', $validated)) {
            if (Reserva::existeColisao($novoQuartoId, $novoInicio, $novoFim, $reserva->id)) {
                return response()->json([
                    'message' => 'Já existe uma reserva para esse quarto nesse período.',
                ], 422);
            }
        }

        $reserva->update($validated);

        return response()->json([
            'message' => 'Reserva editada com sucesso!',
            'data' => $reserva->fresh()->load(['quarto', 'pagamento', 'utilizador']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserva $reserva)
    {
        $this->assertCanAccessReserva(request(), $reserva);
        $reserva->delete();
        return response()->json(['message' => 'Reserva eliminada com sucesso']);
    }
}
