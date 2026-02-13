<?php

namespace App\Filament\Resources\Contacts\Tables;

use App\Filament\Resources\Contacts\ContactResource;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ContactsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-o-envelope'),

                TextColumn::make('phone')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-o-phone')
                    ->placeholder('—'),

                TextColumn::make('message')
                    ->searchable()
                    ->limit(50)
                    ->tooltip(fn(string $state): string => $state),

                BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'new',
                        'info' => 'read',
                        'success' => 'responded',
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'new' => 'New',
                        'read' => 'Read',
                        'responded' => 'Responded',
                        default => ucfirst($state),
                    }),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Received'),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('delete')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn($record) => $record->delete()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
