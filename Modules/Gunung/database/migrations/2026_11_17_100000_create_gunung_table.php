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
        Schema::create('gunung', function (Blueprint $table) {
            $table->id();
            $table->string('nama_gunung');
            $table->string('lokasi');
            $table->unsignedInteger('ketinggian');
            $table->string('tingkat_kesulitan', 20);
            $table->unsignedInteger('harga_tiket');
            $table->text('deskripsi')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gunung');
    }
};