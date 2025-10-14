<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'fullname',
        'phone',
        'password',
        'plan',
        'referral_id',
        'plan_start_date',
        'registration_paid',
        'notifications',
        'last_activity',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'plan_start_date' => 'datetime',
            'password' => 'hashed',
            'registration_paid' => 'boolean',
            'notifications' => 'array',
        ];
    }

    /**
     * Get the accounts for the user.
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Get the complaints for the user.
     */
    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    /**
     * Get the settlement accounts for the user.
     */
    public function settlementAccounts()
    {
        return $this->hasMany(SettlementAccount::class);
    }

    /**
     * Get the payments for the user.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the thrift subscriptions for the user.
     */
    public function thriftSubscriptions()
    {
        return $this->hasMany(ThriftSubscription::class);
    }

    /**
     * Get the settlement clearances for the user.
     */
    public function settlementClearances()
    {
        return $this->hasMany(SettlementClearance::class);
    }

    /**
     * Get the paid settlement accounts for the user.
     */
    public function paidSettlementAccounts()
    {
        return $this->hasMany(PaidSettlementAccount::class);
    }

    /**
     * Get the bulk withdrawal requests for the user.
     */
    public function bulkWithdrawalRequests()
    {
        return $this->hasMany(BulkWithdrawalRequest::class);
    }

    /**
     * Get the next settlement accounts for the user.
     */
    public function nextSettlementAccounts()
    {
        return $this->hasMany(NextSettlementAccount::class);
    }
}
