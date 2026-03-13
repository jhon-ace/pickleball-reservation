<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'court_id',
        'user_id',
        'date',
        'time',
        'mode',
        'status',
        'is_pending'
    ];

    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}