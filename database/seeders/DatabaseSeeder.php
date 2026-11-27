<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            GunungSeeder::class,
            PeralatanSeeder::class,
            BookingSeeder::class,
        ]);

        // Pasang foto gunung dari storage/app/foto_gunung (dilewati kalau folder tidak ada)
        \Illuminate\Support\Facades\Artisan::call('gunung:pasang-foto');
    }
}