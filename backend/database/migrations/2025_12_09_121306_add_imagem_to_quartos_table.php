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
        Schema::table('quartos', function (Blueprint $table) {
            $table->string('imagem')->nullable()->default(null)->comment('URL ou caminho da imagem do quarto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quartos', function (Blueprint $table) {
            $table->dropColumn('imagem');
        });
    }
};
