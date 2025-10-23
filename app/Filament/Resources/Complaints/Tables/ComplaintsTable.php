<?php

namespace App\Filament\Resources\Complaints\Tables;

use App\Filament\Resources\Complaints\ComplaintResource;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ComplaintsTable
{
      public static function configure(Table $table): Table
      {
            return $table
                  ->columns([
                        TextColumn::make('ticket_number')
                              ->searchable()
                              ->sortable()

                              ->weight('bold'),

                        TextColumn::make('title')
                              ->searchable()
                              ->limit(50),

                        TextColumn::make('user.name')
                              ->label('User')
                              ->searchable()
                              ->sortable(),

                        TextColumn::make('category')
                              ->badge()
                              ->colors([
                                    'info' => 'account',
                                    'warning' => 'transaction',
                                    'primary' => 'service',
                                    'secondary' => 'other',
                              ]),

                        TextColumn::make('priority')
                              ->badge()
                              ->colors([
                                    'info' => 'low',
                                    'gray' => 'normal',
                                    'warning' => 'high',
                                    'danger' => 'urgent',
                              ]),

                        TextColumn::make('status')
                              ->badge()
                              ->colors([
                                    'info' => 'open',
                                    'warning' => 'in_progress',
                                    'success' => 'resolved',
                                    'secondary' => 'closed',
                              ]),

                        TextColumn::make('replies_count')
                              ->label('Replies')
                              ->counts('replies')
                              ->sortable(),

                        TextColumn::make('created_at')
                              ->dateTime()
                              ->sortable()
                              ->toggleable(isToggledHiddenByDefault: true),
                  ])
                  ->filters([
                        SelectFilter::make('status')
                              ->options([
                                    'open' => 'Open',
                                    'in_progress' => 'In Progress',
                                    'resolved' => 'Resolved',
                                    'closed' => 'Closed',
                              ]),

                        SelectFilter::make('priority')
                              ->options([
                                    'low' => 'Low',
                                    'normal' => 'Normal',
                                    'high' => 'High',
                                    'urgent' => 'Urgent',
                              ]),

                        SelectFilter::make('category')
                              ->options([
                                    'account' => 'Account',
                                    'transaction' => 'Transaction',
                                    'service' => 'Service',
                                    'other' => 'Other',
                              ]),
                  ])
                  ->recordActions([
                        Action::make('manageReplies')
                              ->label('Manage Replies')
                              ->url(fn($record) => ComplaintResource::getUrl('manageReplies', ['record' => $record->id]))
                              ->icon('heroicon-o-chat-bubble-left-right'),
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
