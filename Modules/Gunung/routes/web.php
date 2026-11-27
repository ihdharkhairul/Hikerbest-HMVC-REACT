<?php

use Illuminate\Support\Facades\Route;
use Modules\Gunung\Http\Controllers\GunungController;

// Admin dan user boleh melihat daftar gunung
Route::middleware(['auth', 'role:admin,user'])->group(function () {
    Route::get('gunung', [GunungController::class, 'index'])->name('gunung.index');
});

// Hanya admin yang boleh mengelola data gunung
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::resource('gunung', GunungController::class)->except(['index', 'show']);
    });