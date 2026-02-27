<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaticAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'account_number',
        'bank_name',
        'account_name',
        'balance',
        'pending_registration_balance',
        'pending_distribution_balance',
        'user_id',
        'is_verified',
        'static_account_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'integer',
        'pending_registration_balance' => 'integer',
        'pending_distribution_balance' => 'integer',
    ];

    /**
     * Get the user that owns the static account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the static account (user-level, no account_id).
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id', 'user_id')
            ->whereNull('account_id');
    }

    /**
     * Generate a unique static account number
     */
    public static function generateAccountNumber(): string
    {
        do {
            $accountNumber = 'SA' . str_pad((string) random_int(0, 9999999999), 10, '0', STR_PAD_LEFT);
        } while (self::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }
}
