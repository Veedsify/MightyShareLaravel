<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make()
                ->icon('heroicon-o-pencil'),

            Action::make('verify_email')
                ->label('Verify Email')
                ->icon('heroicon-o-check-badge')
                ->color('success')
                ->visible(fn($record) => $record->email_verified_at === null)
                ->requiresConfirmation()
                ->action(function ($record) {
                    $record->update(['email_verified_at' => now()]);
                    Notification::make()
                        ->success()
                        ->title('Email verified')
                        ->body('User email has been verified successfully.')
                        ->send();
                }),

            Action::make('mark_registered')
                ->label('Mark as Registered')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->visible(fn($record) => !$record->registration_paid)
                ->requiresConfirmation()
                ->action(function ($record) {
                    $record->update(['registration_paid' => true]);
                    Notification::make()
                        ->success()
                        ->title('Registration marked as paid')
                        ->body('User has been marked as registered.')
                        ->send();
                }),

            Action::make('send_notification')
                ->label('Send Notification')
                ->icon('heroicon-o-bell')
                ->color('warning')
                ->form([
                    \Filament\Forms\Components\TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    \Filament\Forms\Components\Textarea::make('message')
                        ->required()
                        ->rows(3)
                        ->maxLength(500),
                ])
                ->action(function (array $data, $record) {
                    // Add notification logic here
                    Notification::make()
                        ->success()
                        ->title('Notification sent')
                        ->body('Notification has been sent to the user.')
                        ->send();
                }),

            DeleteAction::make()
                ->icon('heroicon-o-trash'),
        ];
    }
}
