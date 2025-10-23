<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make()
                ->icon('heroicon-o-eye'),

            Action::make('generate_referral_id')
                ->label('Generate Referral ID')
                ->icon('heroicon-o-ticket')
                ->color('warning')
                ->visible(fn($record) => empty($record->referral_id))
                ->requiresConfirmation()
                ->action(function ($record) {
                    $record->update(['referral_id' => $record->generateReferralId()]);
                    Notification::make()
                        ->success()
                        ->title('Referral ID generated')
                        ->body('New referral ID: ' . $record->referral_id)
                        ->send();
                }),

            DeleteAction::make()
                ->icon('heroicon-o-trash'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('User updated')
            ->body('The user has been updated successfully.');
    }
}
