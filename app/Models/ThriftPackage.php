<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThriftPackage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'duration',
        'profit_percentage',
        'description',
        'terms',
        'is_active',
        'min_contribution',
        'max_contribution',
        'features',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'integer',
        'duration' => 'integer',
        'profit_percentage' => 'integer',
        'is_active' => 'boolean',
        'min_contribution' => 'integer',
        'max_contribution' => 'integer',
        'features' => 'array',
    ];

    /**
     * Get the subscriptions for the package.
     */
    public function subscriptions()
    {
        return $this->hasMany(ThriftSubscription::class, 'package_id');
    }
}
