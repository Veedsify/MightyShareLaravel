<?php

namespace App\Filament\Resources\Notifications\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NotificationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification Details')
                    ->schema([
                        TextEntry::make('title')
                            ->weight('bold'),
                        TextEntry::make('message')
                            ->columnSpanFull(),
                        TextEntry::make('type')
                            ->badge()
                            ->color(fn(string $state): string => match ($state) {
                                'transaction' => 'primary',
                                'package' => 'success',
                                'settlement' => 'warning',
                                'system' => 'secondary',
                                default => 'gray',
                            }),
                    ]),

                Section::make('Recipient Information')
                    ->schema([
                        TextEntry::make('recipient_type')
                            ->label('Sent To')
                            ->formatStateUsing(fn(string $state): string => match ($state) {
                                'all' => 'All Users',
                                'specific_users' => 'Specific Users',
                                'package_subscribers' => 'Package Subscribers',
                                default => $state,
                            })
                            ->badge()
                            ->color(fn(string $state): string => match ($state) {
                                'all' => 'success',
                                'specific_users' => 'warning',
                                'package_subscribers' => 'info',
                                default => 'gray',
                            }),
                        TextEntry::make('thriftPackage.name')
                            ->label('Thrift Package')
                            ->placeholder('N/A'),
                        TextEntry::make('users_count')
                            ->label('Total Recipients')
                            ->state(fn($record) => $record->users()->count()),
                    ]),

                Section::make('Timing & Metadata')
                    ->schema([
                        TextEntry::make('scheduled_at')
                            ->dateTime()
                            ->placeholder('Sent immediately'),
                        TextEntry::make('createdBy.name')
                            ->label('Created By')
                            ->placeholder('System'),
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ])
                    ->columns(2),
            ]);
    }
}
