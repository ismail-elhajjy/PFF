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
            'title' => 'Premium',
            'city' => 'Marrakech',
            'zone' => 'Medina',
            'type' => 'Classic',
            'size' => 'Medium',
            'image' => 'MarrakechCity.jpg',
            'price' => 50.000,
            'is_available' => true
        ]);
    }
}
