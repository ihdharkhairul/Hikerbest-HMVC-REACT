<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Modules\Booking\Models\Booking;
use Modules\Gunung\Models\Gunung;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $gunungIds = Gunung::pluck('id')->toArray();

        for ($i = 0; $i < 15; $i++) {
            Booking::create([
                'gunung_id' => $faker->randomElement($gunungIds),
                'nama_pendaki' => $faker->name,
                'no_hp' => $faker->numerify('08##########'),
                'tanggal_naik' => $faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
                'jumlah_pendaki' => $faker->numberBetween(1, 8),
                'status' => $faker->randomElement(['Menunggu', 'Dikonfirmasi', 'Dibatalkan']),
            ]);
        }
    }
}