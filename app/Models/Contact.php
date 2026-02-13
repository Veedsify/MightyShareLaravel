<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the status label for display.
     */
    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'new' => 'New',
            'read' => 'Read',
            'responded' => 'Responded',
            default => ucfirst($this->status),
        };
    }

    /**
     * Mark contact as read.
     */
    public function markAsRead(): void
    {
        if ($this->status === 'new') {
            $this->update(['status' => 'read']);
        }
    }

    /**
     * Mark contact as responded.
     */
    public function markAsResponded(): void
    {
        $this->update(['status' => 'responded']);
    }
}
