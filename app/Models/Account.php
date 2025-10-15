<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'account_number',
        'balance',
        'total_contributions',
        'rewards',
        'total_debt',
        'referral_earnings',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'integer',
        'total_contributions' => 'integer',
        'rewards' => 'integer',
        'total_debt' => 'integer',
        'referral_earnings' => 'integer',
    ];

    /**
     * Get the user that owns the account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the account.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the referrals for the account.
     */
    public function referrals()
    {
        return $this->hasMany(Referral::class);
    }

    /**
     * Get the settlement clearances for the account.
     */
    public function settlementClearances()
    {
        return $this->hasMany(SettlementClearance::class);
    }

    /**
     * Get the paid settlement accounts for the account.
     */
    public function paidSettlementAccounts()
    {
        return $this->hasMany(PaidSettlementAccount::class);
    }

    /**
     * Get the next settlement accounts for the account.
     */
    public function nextSettlementAccounts()
    {
        return $this->hasMany(NextSettlementAccount::class);
    }

    /**
     * Convert model to array with camelCase keys for API responses
     *
     * @return array
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'accountNumber' => $this->account_number,
            'balance' => $this->balance,
            'totalContributions' => $this->total_contributions,
            'rewards' => $this->rewards,
            'totalDebt' => $this->total_debt,
            'referralEarnings' => $this->referral_earnings,
            'userId' => $this->user_id,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
