<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ComplaintsRelationManager extends RelationManager
{
      protected static string $relationship = 'complaints';

      protected static ?string $recordTitleAttribute = 'title';

      public function form(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        TextInput::make('title')
                              ->label('Title')
                              ->required()
                              ->maxLength(255)
                              ->columnSpanFull(),

                        Textarea::make('description')
                              ->label('Description')
                              ->required()
                              ->rows(5)
                              ->maxLength(2000)
                              ->columnSpanFull(),

                        Select::make('category')
                              ->label('Category')
                              ->options([
                                    'account' => 'Account',
                                    'transaction' => 'Transaction',
                                    'service' => 'Service',
                                    'technical' => 'Technical',
                                    'other' => 'Other',
                              ])
                              ->required()
                              ->native(false),

                        Select::make('priority')
                              ->label('Priority')
                              ->options([
                                    'low' => 'Low',
                                    'normal' => 'Normal',
                                    'high' => 'High',
                                    'urgent' => 'Urgent',
                              ])
                              ->default('normal')
                              ->required()
                              ->native(false),

                        Select::make('status')
                              ->label('Status')
                              ->options([
                                    'open' => 'Open',
                                    'in_progress' => 'In Progress',
                                    'resolved' => 'Resolved',
                                    'closed' => 'Closed',
                              ])
                              ->default('open')
                              ->required()
                              ->native(false),

                        Textarea::make('resolution')
                              ->label('Resolution Notes')
                              ->rows(4)
                              ->maxLength(2000)
                              ->columnSpanFull(),

                        DateTimePicker::make('resolved_at')
                              ->label('Resolved At')
                              ->native(false)
                              ->displayFormat('d/m/Y H:i'),

                        TextInput::make('ticket_number')
                              ->label('Ticket Number')
                              ->disabled()
                              ->dehydrated(),
                  ]);
      }

      public function table(Table $table): Table
      {
            return $table
                  ->recordTitleAttribute('title')
                  ->columns([
                        Tables\Columns\TextColumn::make('ticket_number')
                              ->label('Ticket #')
                              ->searchable()
                              ->copyable()
                              ->icon('heroicon-o-ticket')
                              ->weight('medium'),

                        Tables\Columns\TextColumn::make('title')
                              ->label('Title')
                              ->searchable()
                              ->limit(40)
                              ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                                    $state = $column->getState();
                                    if (strlen($state) <= 40) {
                                          return null;
                                    }
                                    return $state;
                              })
                              ->weight('medium'),

                        Tables\Columns\TextColumn::make('category')
                              ->label('Category')
                              ->badge()
                              ->colors([
                                    'primary' => 'account',
                                    'success' => 'transaction',
                                    'warning' => 'service',
                                    'info' => 'technical',
                                    'gray' => 'other',
                              ])
                              ->sortable(),

                        Tables\Columns\TextColumn::make('priority')
                              ->label('Priority')
                              ->badge()
                              ->colors([
                                    'gray' => 'low',
                                    'info' => 'normal',
                                    'warning' => 'high',
                                    'danger' => 'urgent',
                              ])
                              ->icons([
                                    'heroicon-o-arrow-down' => 'low',
                                    'heroicon-o-minus' => 'normal',
                                    'heroicon-o-arrow-up' => 'high',
                                    'heroicon-o-exclamation-triangle' => 'urgent',
                              ])
                              ->sortable(),

                        Tables\Columns\TextColumn::make('status')
                              ->label('Status')
                              ->badge()
                              ->colors([
                                    'warning' => 'open',
                                    'info' => 'in_progress',
                                    'success' => 'resolved',
                                    'gray' => 'closed',
                              ])
                              ->icons([
                                    'heroicon-o-envelope-open' => 'open',
                                    'heroicon-o-arrow-path' => 'in_progress',
                                    'heroicon-o-check-circle' => 'resolved',
                                    'heroicon-o-lock-closed' => 'closed',
                              ])
                              ->sortable(),

                        Tables\Columns\TextColumn::make('created_at')
                              ->label('Created')
                              ->dateTime('d M Y')
                              ->sortable()
                              ->since()
                              ->icon('heroicon-o-calendar'),

                        Tables\Columns\TextColumn::make('resolved_at')
                              ->label('Resolved')
                              ->dateTime('d M Y')
                              ->sortable()
                              ->placeholder('Not resolved')
                              ->toggleable(isToggledHiddenByDefault: true),
                  ])
                  ->filters([
                        SelectFilter::make('status')
                              ->options([
                                    'open' => 'Open',
                                    'in_progress' => 'In Progress',
                                    'resolved' => 'Resolved',
                                    'closed' => 'Closed',
                              ])
                              ->label('Status')
                              ->native(false),

                        SelectFilter::make('priority')
                              ->options([
                                    'low' => 'Low',
                                    'normal' => 'Normal',
                                    'high' => 'High',
                                    'urgent' => 'Urgent',
                              ])
                              ->label('Priority')
                              ->native(false),

                        SelectFilter::make('category')
                              ->options([
                                    'account' => 'Account',
                                    'transaction' => 'Transaction',
                                    'service' => 'Service',
                                    'technical' => 'Technical',
                                    'other' => 'Other',
                              ])
                              ->label('Category')
                              ->native(false),
                  ])
                  ->recordActions([
                        ViewAction::make(),
                        EditAction::make(),
                        DeleteAction::make(),
                  ])
                  ->toolbarActions([
                        CreateAction::make()
                              ->mutateFormDataUsing(function (array $data): array {
                                    if (empty($data['ticket_number'])) {
                                          $data['ticket_number'] = \App\Models\Complaint::generateTicketNumber();
                                    }
                                    return $data;
                              }),
                        BulkActionGroup::make([
                              DeleteBulkAction::make(),
                        ]),
                  ])
                  ->defaultSort('created_at', 'desc')
                  ->emptyStateHeading('No complaints yet')
                  ->emptyStateDescription('User complaints will appear here.')
                  ->emptyStateIcon('heroicon-o-chat-bubble-left-right');
      }
}
