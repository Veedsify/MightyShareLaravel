<?php

namespace App\Filament\Resources\Contacts\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Contact Information')
                    ->schema([
                        TextEntry::make('name')
                            ->label('Full Name'),

                        TextEntry::make('email')
                            ->label('Email Address')
                            ->copyable()
                            ->copyableState(fn(string $state): string => "mailto:{$state}"),

                        TextEntry::make('phone')
                            ->label('Phone Number')
                            ->placeholder('Not provided')
                            ->copyable(),

                        TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn(string $state): string => match ($state) {
                                'new' => 'danger',
                                'read' => 'info',
                                'responded' => 'success',
                                default => 'gray',
                            })
                            ->formatStateUsing(fn(string $state): string => match ($state) {
                                'new' => 'New',
                                'read' => 'Read',
                                'responded' => 'Responded',
                                default => ucfirst($state),
                            }),
                    ])->columns(2),

                Section::make('Message')
                    ->schema([
                        TextEntry::make('message')
                            ->label('')
                            ->columnSpanFull()
                            ->markdown(),
                    ]),

                Section::make('Timeline')
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Received')
                            ->dateTime(),

                        TextEntry::make('updated_at')
                            ->label('Last Updated')
                            ->dateTime(),
                    ])->columns(2),
            ]);
    }
}
