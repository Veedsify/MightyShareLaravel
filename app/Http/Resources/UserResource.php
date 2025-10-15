<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'fullname' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'referralId' => $this->referral_id,
            'planStartDate' => $this->plan_start_date?->toISOString(),
            'registrationPaid' => $this->registration_paid,
            'notifications' => $this->notifications,
            'lastActivity' => $this->last_activity?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),

            // Include relationships when loaded
            'accounts' => AccountResource::collection($this->whenLoaded('accounts')),
            'thriftSubscriptions' => ThriftSubscriptionResource::collection($this->whenLoaded('thriftSubscriptions')),
            'complaints' => $this->whenLoaded('complaints'),
            'payments' => $this->whenLoaded('payments'),
        ];
    }
}
