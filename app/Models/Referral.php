<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'referral_code',
        'referred_user_id',
        'referred_name',
        'referred_phone',
        'status',
        'reward_amount',
        'rewarded_at',
        'account_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'referred_user_id' => 'integer',
        'reward_amount' => 'integer',
        'rewarded_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Get the account that owns the referral.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
