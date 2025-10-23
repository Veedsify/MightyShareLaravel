<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AccountsRelationManager extends RelationManager
{
      protected static string $relationship = 'accounts';

      protected static ?string $recordTitleAttribute = 'account_number';

      public function form(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        TextInput::make('account_number')
                              ->label('Account Number')
                              ->required()
                              ->unique(ignoreRecord: true)
                              ->maxLength(255)
                              ->disabled()
                              ->dehydrated(),

                        TextInput::make('balance')
                              ->label('Balance')
                              ->numeric()
                              ->prefix('₦')
                              ->required()
                              ->default(0),

                        TextInput::make('total_contributions')
                              ->label('Total Contributions')
                              ->numeric()
                              ->prefix('₦')
                              ->required()
                              ->default(0),

                        TextInput::make('rewards')
                              ->label('Rewards')
                              ->numeric()
                              ->prefix('₦')
                              ->required()
                              ->default(0),

                        TextInput::make('total_debt')
                              ->label('Total Debt')
                              ->numeric()
                              ->prefix('₦')
                              ->required()
                              ->default(0),

                        TextInput::make('referral_earnings')
                              ->label('Referral Earnings')
                              ->numeric()
                              ->prefix('₦')
                              ->required()
                              ->default(0),

                        Toggle::make('is_paid')
                              ->label('Is Paid')
                              ->default(false),
                  ]);
      }

      public function table(Table $table): Table
      {
            return $table
                  ->recordTitleAttribute('account_number')
                  ->columns([
                        Tables\Columns\TextColumn::make('account_number')
                              ->label('Account Number')
                              ->searchable()
                              ->sortable()
                              ->copyable()
                              ->icon('heroicon-o-hashtag')
                              ->weight('medium'),

                        Tables\Columns\TextColumn::make('balance')
                              ->label('Balance')
                              ->money('NGN')
                              ->sortable()
                              ->color(fn($state) => $state > 0 ? 'success' : ($state < 0 ? 'danger' : 'gray'))
                              ->weight('bold'),

                        Tables\Columns\TextColumn::make('total_contributions')
                              ->label('Contributions')
                              ->money('NGN')
                              ->sortable()
                              ->icon('heroicon-o-arrow-trending-up')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('rewards')
                              ->label('Rewards')
                              ->money('NGN')
                              ->sortable()
                              ->icon('heroicon-o-gift')
                              ->color('warning')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('total_debt')
                              ->label('Debt')
                              ->money('NGN')
                              ->sortable()
                              ->color(fn($state) => $state > 0 ? 'danger' : 'success')
                              ->icon('heroicon-o-exclamation-circle')
                              ->toggleable(),

                        Tables\Columns\TextColumn::make('referral_earnings')
                              ->label('Referral Earnings')
                              ->money('NGN')
                              ->sortable()
                              ->icon('heroicon-o-users')
                              ->color('info')
                              ->toggleable(),

                        Tables\Columns\IconColumn::make('is_paid')
                              ->label('Paid Status')
                              ->boolean()
                              ->trueIcon('heroicon-o-check-circle')
                              ->falseIcon('heroicon-o-x-circle')
                              ->trueColor('success')
                              ->falseColor('danger'),

                        Tables\Columns\TextColumn::make('created_at')
                              ->label('Created')
                              ->dateTime('d M Y')
                              ->sortable()
                              ->toggleable(isToggledHiddenByDefault: true)
                              ->since(),
                  ])
                  ->filters([
                        TernaryFilter::make('is_paid')
                              ->label('Payment Status')
                              ->placeholder('All accounts')
                              ->trueLabel('Paid')
                              ->falseLabel('Unpaid')
                              ->native(false),

                        Filter::make('has_debt')
                              ->label('Has Debt')
                              ->query(fn(Builder $query): Builder => $query->where('total_debt', '>', 0))
                              ->toggle(),

                        Filter::make('has_balance')
                              ->label('Has Balance')
                              ->query(fn(Builder $query): Builder => $query->where('balance', '>', 0))
                              ->toggle(),
                  ])
                  ->recordActions([
                        ViewAction::make(),
                        EditAction::make(),
                        DeleteAction::make(),
                  ])
                  ->toolbarActions([
                        CreateAction::make()
                              ->mutateFormDataUsing(function (array $data): array {
                                    if (empty($data['account_number'])) {
                                          $data['account_number'] = $this->getOwnerRecord()->generateAccountNumber();
                                    }
                                    return $data;
                              }),
                        BulkActionGroup::make([
                              DeleteBulkAction::make(),
                        ]),
                  ])
                  ->defaultSort('created_at', 'desc')
                  ->emptyStateHeading('No accounts yet')
                  ->emptyStateDescription('Create an account to get started.')
                  ->emptyStateIcon('heroicon-o-wallet');
      }
}
