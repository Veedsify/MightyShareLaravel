<?php

namespace App\Filament\Resources\Users\RelationManagers;

use App\Models\ThriftPackage;
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

class ThriftSubscriptionsRelationManager extends RelationManager
{
      protected static string $relationship = 'thriftSubscriptions';

      protected static ?string $recordTitleAttribute = 'id';

      protected static ?string $title = 'Thrift Subscriptions';

      public function form(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        Select::make('package_id')
                              ->label('Package')
                              ->options(ThriftPackage::all()->pluck('name', 'id'))
                              ->required()
                              ->searchable()
                              ->native(false),

                        TextInput::make('amount_invested')
                              ->label('Amount Invested')
                              ->numeric()
                              ->prefix('₦')
                              ->required(),

                        DateTimePicker::make('start_date')
                              ->label('Start Date')
                              ->native(false)
                              ->displayFormat('d/m/Y H:i')
                              ->required(),

                        DateTimePicker::make('end_date')
                              ->label('End Date')
                              ->native(false)
                              ->displayFormat('d/m/Y H:i')
                              ->required(),

                        Select::make('status')
                              ->label('Status')
                              ->options([
                                    'active' => 'Active',
                                    'pending' => 'Pending',
                                    'completed' => 'Completed',
                                    'cancelled' => 'Cancelled',
                              ])
                              ->default('pending')
                              ->required()
                              ->native(false),

                        TextInput::make('expected_return')
                              ->label('Expected Return')
                              ->numeric()
                              ->prefix('₦'),

                        TextInput::make('actual_return')
                              ->label('Actual Return')
                              ->numeric()
                              ->prefix('₦'),

                        DateTimePicker::make('completed_at')
                              ->label('Completed At')
                              ->native(false)
                              ->displayFormat('d/m/Y H:i'),

                        DateTimePicker::make('cancelled_at')
                              ->label('Cancelled At')
                              ->native(false)
                              ->displayFormat('d/m/Y H:i'),

                        Textarea::make('notes')
                              ->label('Notes')
                              ->rows(3)
                              ->maxLength(1000)
                              ->columnSpanFull(),
                  ]);
      }

      public function table(Table $table): Table
      {
            return $table
                  ->recordTitleAttribute('id')
                  ->columns([
                        Tables\Columns\TextColumn::make('package.name')
                              ->label('Package')
                              ->searchable()
                              ->sortable()
                              ->icon('heroicon-o-gift')
                              ->weight('medium'),

                        Tables\Columns\TextColumn::make('amount_invested')
                              ->label('Invested')
                              ->money('NGN')
                              ->sortable()
                              ->color('primary')
                              ->weight('bold'),

                        Tables\Columns\TextColumn::make('expected_return')
                              ->label('Expected Return')
                              ->money('NGN')
                              ->sortable()
                              ->color('success')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('actual_return')
                              ->label('Actual Return')
                              ->money('NGN')
                              ->sortable()
                              ->color('warning')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('status')
                              ->label('Status')
                              ->badge()
                              ->colors([
                                    'success' => 'active',
                                    'warning' => 'pending',
                                    'info' => 'completed',
                                    'danger' => 'cancelled',
                              ])
                              ->icons([
                                    'heroicon-o-check-circle' => 'active',
                                    'heroicon-o-clock' => 'pending',
                                    'heroicon-o-check-badge' => 'completed',
                                    'heroicon-o-x-circle' => 'cancelled',
                              ])
                              ->sortable(),

                        Tables\Columns\TextColumn::make('start_date')
                              ->label('Start Date')
                              ->date('d M Y')
                              ->sortable()
                              ->icon('heroicon-o-calendar')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('end_date')
                              ->label('End Date')
                              ->date('d M Y')
                              ->sortable()
                              ->icon('heroicon-o-calendar')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('created_at')
                              ->label('Created')
                              ->dateTime('d M Y')
                              ->sortable()
                              ->since()
                              ->toggleable(isToggledHiddenByDefault: true),
                  ])
                  ->filters([
                        SelectFilter::make('status')
                              ->options([
                                    'active' => 'Active',
                                    'pending' => 'Pending',
                                    'completed' => 'Completed',
                                    'cancelled' => 'Cancelled',
                              ])
                              ->label('Subscription Status')
                              ->native(false),
                  ])
                  ->recordActions([
                        ViewAction::make(),
                        EditAction::make(),
                        DeleteAction::make(),
                  ])
                  ->toolbarActions([
                        CreateAction::make(),
                        BulkActionGroup::make([
                              DeleteBulkAction::make(),
                        ]),
                  ])
                  ->defaultSort('created_at', 'desc')
                  ->emptyStateHeading('No subscriptions yet')
                  ->emptyStateDescription('Create a thrift subscription to get started.')
                  ->emptyStateIcon('heroicon-o-gift');
      }
}
