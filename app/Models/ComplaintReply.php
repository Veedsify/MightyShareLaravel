<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplaintReply extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'complaint_id',
        'user_id',
        'message',
        'type',
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
     * Get the complaint this reply belongs to
     */
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    /**
     * Get the user who created this reply
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
