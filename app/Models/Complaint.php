<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'status',
        'priority',
        'resolution',
        'ticket_number',
        'resolved_at',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the user that owns the complaint.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all replies for this complaint
     */
    public function replies()
    {
        return $this->hasMany(ComplaintReply::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the latest reply for this complaint
     */
    public function latestReply()
    {
        return $this->hasOne(ComplaintReply::class)->latestOfMany();
    }

    /**
     * Generate a unique ticket number
     */
    public static function generateTicketNumber(): string
    {
        do {
            $ticketNumber = 'TKT-' . str_pad(mt_rand(0, 9999999), 7, '0', STR_PAD_LEFT);
        } while (self::where('ticket_number', $ticketNumber)->exists());
        return $ticketNumber;
    }
}
