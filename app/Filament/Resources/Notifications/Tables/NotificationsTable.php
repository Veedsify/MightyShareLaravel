<?php

namespace App\Filament\Resources\Notifications\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class NotificationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('message')
                    ->limit(50)
                    ->searchable(),

                BadgeColumn::make('type')
                    ->colors([
                        'primary' => 'transaction',
                        'success' => 'package',
                        'warning' => 'settlement',
                        'secondary' => 'system',
                    ]),

                BadgeColumn::make('recipient_type')
                    ->label('Recipients')
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'all' => 'All Users',
                        'specific_users' => 'Specific Users',
                        'package_subscribers' => 'Package Subscribers',
                        default => $state,
                    })
                    ->colors([
                        'success' => 'all',
                        'warning' => 'specific_users',
                        'info' => 'package_subscribers',
                    ]),

                TextColumn::make('thriftPackage.name')
                    ->label('Package')
                    ->toggleable()
                    ->sortable(),

                TextColumn::make('users_count')
                    ->label('Sent To')
                    ->counts('users')
                    ->sortable(),

                TextColumn::make('scheduled_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'transaction' => 'Transaction',
                        'package' => 'Package',
                        'settlement' => 'Settlement',
                        'system' => 'System',
                    ]),

                SelectFilter::make('recipient_type')
                    ->label('Recipient Type')
                    ->options([
                        'all' => 'All Users',
                        'specific_users' => 'Specific Users',
                        'package_subscribers' => 'Package Subscribers',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
