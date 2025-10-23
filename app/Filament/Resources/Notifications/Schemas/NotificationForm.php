<?php

namespace App\Filament\Resources\Notifications\Schemas;

use App\Models\ThriftPackage;
use App\Models\User;
use Filament\Forms\Components\DateTimePicker;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class NotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification Details')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Textarea::make('message')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),

                        Select::make('type')
                            ->options([
                                'transaction' => 'Transaction',
                                'package' => 'Package',
                                'settlement' => 'Settlement',
                                'system' => 'System',
                            ])
                            ->required()
                            ->default('system'),
                    ]),

                Section::make('Recipient Settings')
                    ->schema([
                        Select::make('recipient_type')
                            ->label('Send To')
                            ->options([
                                'all' => 'All Users',
                                'specific_users' => 'Specific Users',
                                'package_subscribers' => 'Package Subscribers',
                            ])
                            ->required()
                            ->default('all')
                            ->live()
                            ->afterStateUpdated(fn($state, callable $set) => $set('user_ids', null)),

                        Select::make('thrift_package_id')
                            ->label('Thrift Package')
                            ->options(ThriftPackage::all()->pluck('name', 'id'))
                            ->searchable()
                            ->visible(fn(Get $get) => $get('recipient_type') === 'package_subscribers')
                            ->required(fn(Get $get) => $get('recipient_type') === 'package_subscribers'),

                        Select::make('user_ids')
                            ->label('Select Users')
                            ->options(User::all()->pluck('name', 'id'))
                            ->multiple()
                            ->searchable()
                            ->visible(fn(Get $get) => $get('recipient_type') === 'specific_users')
                            ->required(fn(Get $get) => $get('recipient_type') === 'specific_users'),
                    ]),

                Section::make('Scheduling')
                    ->schema([
                        DateTimePicker::make('scheduled_at')
                            ->label('Schedule For')
                            ->helperText('Leave empty to send immediately')
                            ->timezone('Africa/Lagos')
                            ->seconds(false),
                    ]),
            ]);
    }
}
