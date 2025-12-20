<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'ativo')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('ativo')->default(true)->after('cargo');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'ativo')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('ativo');
            });
        }
    }
};
