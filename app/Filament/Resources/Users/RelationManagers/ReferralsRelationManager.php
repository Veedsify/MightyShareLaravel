<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ReferralsRelationManager extends RelationManager
{
        protected static string $relationship = 'referrals';

        protected static ?string $title = 'Referrals';

        protected static ?string $recordTitleAttribute = 'id';

        public function form(Schema $schema): Schema
        {
                return $schema
                        ->components([
                                Select::make('referred_id')
                                        ->label('Referred User')
                                        ->relationship('referred', 'name')
                                        ->searchable()
                                        ->preload()
                                        ->required(),

                                TextInput::make('points_earned')
                                        ->label('Points Earned')
                                        ->numeric()
                                        ->default(10)
                                        ->required(),

                                Select::make('status')
                                        ->label('Status')
                                        ->options([
                                                'active' => 'Active',
                                                'rewarded' => 'Rewarded',
                                        ])
                                        ->default('active')
                                        ->required(),
                        ]);
        }

        public function table(Table $table): Table
        {
                return $table
                        ->columns([
                                TextColumn::make('referred.name')
                                        ->label('Referred User')
                                        ->searchable()
                                        ->sortable(),

                                TextColumn::make('referred.email')
                                        ->label('Email')
                                        ->searchable(),

                                TextColumn::make('referred.phone')
                                        ->label('Phone'),

                                TextColumn::make('points_earned')
                                        ->label('Points')
                                        ->sortable()
                                        ->badge()
                                        ->color('success'),

                                TextColumn::make('status')
                                        ->label('Status')
                                        ->badge()
                                        ->color(fn(string $state): string => match ($state) {
                                                'active' => 'info',
                                                'rewarded' => 'success',
                                                default => 'gray',
                                        }),

                                TextColumn::make('created_at')
                                        ->label('Referred On')
                                        ->dateTime()
                                        ->sortable(),
                        ])
                        ->filters([
                                SelectFilter::make('status')
                                        ->options([
                                                'active' => 'Active',
                                                'rewarded' => 'Rewarded',
                                        ]),
                        ])
                        ->headerActions([])
                        ->actions([
                                ViewAction::make(),
                        ])
                        ->defaultSort('created_at', 'desc');
        }
}
