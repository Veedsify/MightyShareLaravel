<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'month',
        'package_id',
        'status',
        'total_distributed',
        'total_shortfall',
        'accounts_processed',
        'error_message',
    ];

    protected $casts = [
        'total_distributed' => 'integer',
        'total_shortfall' => 'integer',
        'accounts_processed' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(ThriftPackage::class, 'package_id');
    }
}
