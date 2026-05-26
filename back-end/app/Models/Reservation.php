<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'billboard_id',
        'company_name',
        'phone',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'creative_path',
    ];

    protected $casts = [
        'total_price' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];



    
    // Every reservation belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Every reservation belongs to a billboard
    public function billboard()
    {
        return $this->belongsTo(Billboard::class);
    }
}
