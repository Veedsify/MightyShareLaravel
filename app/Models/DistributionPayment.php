<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributionPayment extends Model
{
    protected $fillable = [
        'user_id',
        'account_id',
        'thrift_package_id',
        'month',
        'amount',
        'status',
        'reference',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function package()
    {
        return $this->belongsTo(ThriftPackage::class, 'thrift_package_id');
    }
}
