<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'message',
        'type',
        'recipient_type',
        'thrift_package_id',
        'user_ids',
        'created_by',
        'scheduled_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_ids' => 'array',
        'scheduled_at' => 'datetime',
    ];

    /**
     * Get the users that should receive this notification
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_user')
            ->withPivot('read', 'read_at')
            ->withTimestamps();
    }

    /**
     * Get the thrift package associated with this notification
     */
    public function thriftPackage()
    {
        return $this->belongsTo(ThriftPackage::class);
    }

    /**
     * Get the admin who created this notification
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all recipients for this notification based on recipient_type
     */
    public function getRecipientsQuery()
    {
        switch ($this->recipient_type) {
            case 'all':
                return User::query();

            case 'specific_users':
                return User::whereIn('id', $this->user_ids ?? []);

            case 'package_subscribers':
                return User::whereHas('thriftSubscriptions', function ($query) {
                    $query->where('package_id', $this->thrift_package_id);
                });

            default:
                return User::query()->whereRaw('1 = 0'); // Empty query
        }
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
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'read' => $this->pivot?->read ?? false,
            'date' => $this->created_at?->diffForHumans(),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
