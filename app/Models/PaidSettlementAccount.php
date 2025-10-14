<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaidSettlementAccount extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

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
        'settlement_date',
        'reference',
        'payment_method',
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
        'settlement_date' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that owns the paid settlement account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the account that owns the paid settlement account.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
