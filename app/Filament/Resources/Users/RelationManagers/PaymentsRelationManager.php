<?php

namespace App\Filament\Resources\Users\RelationManagers;

use App\Enums\PaymentStatus;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
      protected static string $relationship = 'payments';

      protected static ?string $recordTitleAttribute = 'order_id';

      public function form(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        TextInput::make('amount')
                              ->label('Amount')
                              ->numeric()
                              ->prefix('₦')
                              ->required(),

                        TextInput::make('currency')
                              ->label('Currency')
                              ->default('NGN')
                              ->required(),

                        TextInput::make('order_id')
                              ->label('Order ID')
                              ->required()
                              ->maxLength(255),

                        Textarea::make('description')
                              ->label('Description')
                              ->rows(3)
                              ->maxLength(1000),

                        TextInput::make('customer_email')
                              ->label('Customer Email')
                              ->email()
                              ->maxLength(255),

                        TextInput::make('customer_phone')
                              ->label('Customer Phone')
                              ->tel()
                              ->maxLength(255),

                        TextInput::make('customer_first_name')
                              ->label('First Name')
                              ->maxLength(255),

                        TextInput::make('customer_last_name')
                              ->label('Last Name')
                              ->maxLength(255),

                        Select::make('status')
                              ->label('Status')
                              ->options([
                                    'pending' => 'Pending',
                                    'processing' => 'Processing',
                                    'completed' => 'Completed',
                                    'failed' => 'Failed',
                                    'cancelled' => 'Cancelled',
                              ])
                              ->default('pending')
                              ->required()
                              ->native(false),
                  ]);
      }

      public function table(Table $table): Table
      {
            return $table
                  ->recordTitleAttribute('order_id')
                  ->columns([
                        Tables\Columns\TextColumn::make('order_id')
                              ->label('Order ID')
                              ->searchable()
                              ->copyable()
                              ->icon('heroicon-o-hashtag')
                              ->weight('medium'),

                        Tables\Columns\TextColumn::make('amount')
                              ->label('Amount')
                              ->money('NGN')
                              ->sortable()
                              ->weight('bold')
                              ->color('success'),

                        Tables\Columns\TextColumn::make('status')
                              ->label('Status')
                              ->badge()
                              ->colors([
                                    'warning' => 'pending',
                                    'info' => 'processing',
                                    'success' => 'completed',
                                    'danger' => 'failed',
                                    'gray' => 'cancelled',
                              ])
                              ->icons([
                                    'heroicon-o-clock' => 'pending',
                                    'heroicon-o-arrow-path' => 'processing',
                                    'heroicon-o-check-circle' => 'completed',
                                    'heroicon-o-x-circle' => 'failed',
                                    'heroicon-o-ban' => 'cancelled',
                              ])
                              ->sortable(),

                        Tables\Columns\TextColumn::make('description')
                              ->label('Description')
                              ->limit(30)
                              ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                                    $state = $column->getState();
                                    if (strlen($state) <= 30) {
                                          return null;
                                    }
                                    return $state;
                              })
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('customer_email')
                              ->label('Email')
                              ->searchable()
                              ->copyable()
                              ->icon('heroicon-o-envelope')
                              ->toggleable(isToggledHiddenByDefault: true),

                        Tables\Columns\TextColumn::make('customer_phone')
                              ->label('Phone')
                              ->searchable()
                              ->copyable()
                              ->icon('heroicon-o-phone')
                              ->toggleable(isToggledHiddenByDefault: true),

                        Tables\Columns\TextColumn::make('created_at')
                              ->label('Date')
                              ->dateTime('d M Y, H:i')
                              ->sortable()
                              ->since()
                              ->icon('heroicon-o-calendar'),
                  ])
                  ->filters([
                        SelectFilter::make('status')
                              ->options([
                                    'pending' => 'Pending',
                                    'processing' => 'Processing',
                                    'completed' => 'Completed',
                                    'failed' => 'Failed',
                                    'cancelled' => 'Cancelled',
                              ])
                              ->label('Payment Status')
                              ->native(false),
                  ])
                  ->recordActions([
                        ViewAction::make(),
                  ])
                  ->toolbarActions([
                        BulkActionGroup::make([
                              DeleteBulkAction::make(),
                        ]),
                  ])
                  ->defaultSort('created_at', 'desc')
                  ->emptyStateHeading('No payments yet')
                  ->emptyStateDescription('Payment records will appear here.')
                  ->emptyStateIcon('heroicon-o-banknotes');
      }
}
