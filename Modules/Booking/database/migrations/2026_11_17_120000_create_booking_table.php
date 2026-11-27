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
        Schema::create('booking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gunung_id')->constrained('gunung')->cascadeOnDelete();
            $table->string('nama_pendaki');
            $table->string('no_hp', 20);
            $table->date('tanggal_naik');
            $table->unsignedInteger('jumlah_pendaki');
            $table->string('status', 20)->default('Menunggu');
            $table->string('bukti_bayar')->nullable();
            $table->string('nama_bukti')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};