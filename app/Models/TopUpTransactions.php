<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopUpTransactions extends Model
{
    /** @use HasFactory<\Database\Factories\TopUpTransactionsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'reference',
        'transaction_id',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
