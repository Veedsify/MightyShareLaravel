<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkWithdrawalRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'request_id',
        'account_numbers',
        'total_amount',
        'status',
        'requested_by',
        'approved_by',
        'approved_at',
        'completed_at',
        'rejected_at',
        'rejection_reason',
        'notes',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'account_numbers' => 'array',
        'total_amount' => 'integer',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Get the user that owns the bulk withdrawal request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
