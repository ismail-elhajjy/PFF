<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BillboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('billboards')->insert([
            'title' => 'Atlas',
            'city' => 'Tanger',
            'zone' => 'Malabata',
            'type' => 'Classic',
            'size' => 'Large',
            'image' => 'TangerCity.jpg',
            'price' => 10.000,
            'is_available' => true
        ]);
    }
}
