<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NextOfKin extends Model
{
    //

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'gender',
        'date_of_birth',
        'relationship',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
