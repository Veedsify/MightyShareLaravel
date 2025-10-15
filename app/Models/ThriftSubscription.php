<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThriftSubscription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'package_id',
        'amount_invested',
        'start_date',
        'end_date',
        'status',
        'expected_return',
        'actual_return',
        'completed_at',
        'cancelled_at',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount_invested' => 'integer',
        'expected_return' => 'integer',
        'actual_return' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Get the user that owns the subscription.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the package that owns the subscription.
     */
    public function package()
    {
        return $this->belongsTo(ThriftPackage::class, 'package_id');
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
            'userId' => $this->user_id,
            'packageId' => $this->package_id,
            'amountInvested' => $this->amount_invested,
            'startDate' => $this->start_date?->toISOString(),
            'endDate' => $this->end_date?->toISOString(),
            'status' => $this->status,
            'expectedReturn' => $this->expected_return,
            'actualReturn' => $this->actual_return,
            'completedAt' => $this->completed_at?->toISOString(),
            'cancelledAt' => $this->cancelled_at?->toISOString(),
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
