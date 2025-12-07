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
        Schema::create('quartos', function (Blueprint $table) {
            $table->id();
            $table->integer('numero');
            $table->foreignId('andar_id')->constrained('andars')->onDelete('cascade');
            $table->string('tipo');
            $table->integer('capacidade');
            $table->string('estado');
            $table->decimal('preco_por_dia');
            $table->integer('posicao_x')->nullable();
            $table->integer('posicao_y')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quartos');
    }
};
