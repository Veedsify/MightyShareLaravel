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
        'name',
        'email',
        'phone',
        'password',
        'referral_id',
        'plan_start_date',
        'registration_paid',
        'notifications',
        'last_activity',
        'date_of_birth',
        'email_notifications',
        'sms_notifications',
        'transaction_alerts',
        'marketing_emails',
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
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'registration_paid' => 'boolean',
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'transaction_alerts' => 'boolean',
            'marketing_emails' => 'boolean',
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

    /**
     * Get the static account for the user.
     */
    public function staticAccount()
    {
        return $this->hasOne(StaticAccount::class);
    }

    /**
     * Get the notifications for the user.
     */
    public function userNotifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_user')
            ->withPivot('read', 'read_at')
            ->withTimestamps()
            ->orderBy('created_at', 'desc');
    }

    /**
     * Generate a unique referral ID
     *
     * @return string
     */
    public function generateReferralId(): string
    {
        do {
            $referralId = 'REF-' . time() . rand(100, 999);
        } while (self::where('referral_id', $referralId)->exists());

        return $referralId;
    }

    /**
     * Generate a unique account number
     *
     * @return string
     */
    public function generateAccountNumber(): string
    {
        do {
            $accountNumber = 'MS' . time() . rand(100, 999);
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }

    /**
     * Check if registration payment has been made
     *
     * @return bool
     */
    public function isRegistrationPaid(): bool
    {
        return $this->registration_paid;
    }

    /**
     * Get the active thrift subscription for the user
     *
     * @return \App\Models\ThriftSubscription|null
     */
    public function getActiveThriftSubscription()
    {
        return $this->thriftSubscriptions()
            ->where('status', 'active')
            ->with('package')
            ->first();
    }

    /**
     * Get the referral ID in camelCase format
     *
     * @return string|null
     */
    public function getReferralIdAttribute($value)
    {
        return $value;
    }

    /**
     * Get the registration paid status in camelCase format
     *
     * @return bool
     */
    public function getRegistrationPaidAttribute($value)
    {
        return (bool) $value;
    }

    /**
     * Get the plan start date in camelCase format
     *
     * @return string|null
     */
    public function getPlanStartDateAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    /**
     * Get the last activity in camelCase format
     *
     * @return string|null
     */
    public function getLastActivityAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
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
            'fullname' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'referralId' => $this->referral_id,
            'planStartDate' => $this->plan_start_date?->toISOString(),
            'registrationPaid' => $this->registration_paid,
            'notifications' => $this->notifications,
            'lastActivity' => $this->last_activity?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
