<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Envia link de reset de password por email.
     * Resposta é sempre genérica para não revelar se o utilizador existe.
     */
    public function forgot(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        // Mesmo se for INVALID_USER, devolvemos 200 com mensagem genérica.
        return response()->json([
            'message' => 'Se o email existir no sistema, enviámos um link para redefinir a password.',
            'status' => $status,
        ]);
    }

    /**
     * Efetiva o reset de password.
     */
    public function reset(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::reset(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'password_confirmation' => $request->input('password_confirmation'),
                'token' => $validated['token'],
            ],
            function ($user) use ($validated) {
                $user->forceFill([
                    'password' => Hash::make($validated['password']),
                    'remember_token' => Str::random(60),
                ])->save();

                // Corta sessões/token existentes.
                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
                'status' => $status,
            ], 422);
        }

        return response()->json([
            'message' => 'Password alterada com sucesso.',
            'status' => $status,
        ]);
    }
}
