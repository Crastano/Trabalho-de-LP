<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('quartos', 'imagem')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->string('imagem')->nullable()->after('posicao_y');
            });
        }

        if (!Schema::hasColumn('quartos', 'destaque')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->boolean('destaque')->default(false)->after('imagem');
            });
        }

        if (!Schema::hasColumn('quartos', 'camas')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->string('camas')->nullable()->after('destaque');
            });
        }

        if (!Schema::hasColumn('quartos', 'wifi')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->boolean('wifi')->default(true)->after('camas');
            });
        }

        if (!Schema::hasColumn('quartos', 'ar_condicionado')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->boolean('ar_condicionado')->default(true)->after('wifi');
            });
        }

        if (!Schema::hasColumn('quartos', 'tv')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->boolean('tv')->default(true)->after('ar_condicionado');
            });
        }

        if (!Schema::hasColumn('quartos', 'descricao')) {
            Schema::table('quartos', function (Blueprint $table) {
                $table->text('descricao')->nullable()->after('tv');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $toDrop = [];

        foreach (['imagem', 'destaque', 'camas', 'wifi', 'ar_condicionado', 'tv', 'descricao'] as $col) {
            if (Schema::hasColumn('quartos', $col)) {
                $toDrop[] = $col;
            }
        }

        if (count($toDrop)) {
            Schema::table('quartos', function (Blueprint $table) use ($toDrop) {
                $table->dropColumn($toDrop);
            });
        }
    }
};
