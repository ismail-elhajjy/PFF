<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billboard extends Model
{
    protected $fillable = [
        'title',
        'city',
        'zone',
        'type',
        'size',
        'image',
        'price',
        'is_available',
    ];
}
