<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('User created')
            ->body('The user has been created successfully.');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Auto-generate referral ID if not provided
        if (empty($data['referral_id'])) {
            $user = new \App\Models\User();
            $data['referral_id'] = $user->generateReferralId();
        }

        return $data;
    }
}
