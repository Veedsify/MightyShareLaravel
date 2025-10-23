<?php

namespace App\Filament\Resources\Notifications\Pages;

use App\Filament\Resources\Notifications\NotificationResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateNotification extends CreateRecord
{
    protected static string $resource = NotificationResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = Auth::id();

        return $data;
    }

    protected function afterCreate(): void
    {
        // Attach notification to users based on recipient_type
        $notification = $this->record;

        $users = $notification->getRecipientsQuery()->get();

        // Attach users to the notification
        $notification->users()->attach(
            $users->pluck('id')->toArray(),
            ['created_at' => now(), 'updated_at' => now()]
        );
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
