<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NextSettlementAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'account_number',
        'account_name',
        'bank_name',
        'amount',
        'scheduled_date',
        'settlement_cycle',
        'priority',
        'status',
        'notes',
        'user_id',
        'account_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'integer',
        'scheduled_date' => 'datetime',
    ];

    /**
     * Get the user that owns the next settlement account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the account that owns the next settlement account.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
