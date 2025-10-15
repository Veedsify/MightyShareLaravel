<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThriftPackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'duration' => $this->duration,
            'profitPercentage' => $this->profit_percentage,
            'description' => $this->description,
            'terms' => $this->terms,
            'isActive' => $this->is_active,
            'minContribution' => $this->min_contribution,
            'maxContribution' => $this->max_contribution,
            'features' => $this->features,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
