<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
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
            'accountNumber' => $this->account_number,
            'balance' => $this->balance,
            'totalContributions' => $this->total_contributions,
            'rewards' => $this->rewards,
            'totalDebt' => $this->total_debt,
            'referralEarnings' => $this->referral_earnings,
            'userId' => $this->user_id,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),

            // Include relationships when loaded
            'user' => new UserResource($this->whenLoaded('user')),
            'transactions' => $this->whenLoaded('transactions'),
            'referrals' => $this->whenLoaded('referrals'),
        ];
    }
}
