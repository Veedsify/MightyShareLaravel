<?php

namespace App\Filament\Resources\Complaints\Schemas;

use Filament\Infolists\Components\Fieldset;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ComplaintInfolist
{
      public static function configure(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        Section::make('Complaint Details')
                              ->schema([
                                    TextEntry::make('ticket_number')
                                          ->label('Ticket Number')
                                          ->weight('bold'),

                                    TextEntry::make('title')
                                          ->weight('bold')
                                          ->columnSpanFull(),

                                    TextEntry::make('description')
                                          ->columnSpanFull()
                                          ->markdown(),

                                    TextEntry::make('category')
                                          ->badge()
                                          ->color(fn(string $state): string => match ($state) {
                                                'account' => 'info',
                                                'transaction' => 'warning',
                                                'service' => 'primary',
                                                'other' => 'secondary',
                                                default => 'gray',
                                          }),

                                    TextEntry::make('priority')
                                          ->badge()
                                          ->color(fn(string $state): string => match ($state) {
                                                'low' => 'info',
                                                'normal' => 'gray',
                                                'high' => 'warning',
                                                'urgent' => 'danger',
                                                default => 'gray',
                                          }),
                              ])
                              ->columns(2),

                        Section::make('Status & Resolution')
                              ->schema([
                                    TextEntry::make('status')
                                          ->badge()
                                          ->color(fn(string $state): string => match ($state) {
                                                'open' => 'info',
                                                'in_progress' => 'warning',
                                                'resolved' => 'success',
                                                'closed' => 'secondary',
                                                default => 'gray',
                                          }),

                                    TextEntry::make('resolved_at')
                                          ->dateTime(),

                                    TextEntry::make('resolution')
                                          ->columnSpanFull()
                                          ->markdown()
                                          ->placeholder('No resolution notes yet'),
                              ])
                              ->columns(2),

                        Section::make('User Information')
                              ->schema([
                                    TextEntry::make('user.name')
                                          ->label('Submitted By'),

                                    TextEntry::make('user.email')
                                          ->label('Email'),

                                    TextEntry::make('created_at')
                                          ->dateTime()
                                          ->label('Submitted At'),
                              ])
                              ->columns(2),

                        Section::make('Replies')
                              ->schema([
                                    // Replies will be shown in a separate relation manager
                              ]),
                  ]);
      }
}
