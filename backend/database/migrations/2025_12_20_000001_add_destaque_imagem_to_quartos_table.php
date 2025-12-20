<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
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
    }

    public function down(): void
    {
        $toDrop = [];
        foreach (['imagem', 'destaque'] as $col) {
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
