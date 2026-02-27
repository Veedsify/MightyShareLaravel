<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reference',
        'amount',
        'type',
        'direction',
        'status',
        'payment_method',
        'description',
        'platform_transaction_reference',
        'account_id',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Get the account that owns the transaction.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the user that owns the transaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a unique transaction reference.
     */
    public static function generateReference(string $prefix = 'TXN'): string
    {
        do {
            $reference = $prefix . '-' . now()->format('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
        } while (self::where('reference', $reference)->exists());

        return $reference;
    }
}
