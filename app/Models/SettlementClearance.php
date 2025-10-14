<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SettlementClearance extends Model
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
        'amount',
        'bank_name',
        'due_date',
        'status',
        'priority',
        'notes',
        'cleared_at',
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
        'due_date' => 'datetime',
        'cleared_at' => 'datetime',
    ];

    /**
     * Get the user that owns the settlement clearance.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the account that owns the settlement clearance.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
