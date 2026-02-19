<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Personal Information')
                    ->description('Basic user information and identity details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Full Name')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('John Doe'),

                                DatePicker::make('date_of_birth')
                                    ->label('Date of Birth')
                                    ->native(false)
                                    ->displayFormat('d/m/Y')
                                    ->maxDate(now()->subYears(18))
                                    ->placeholder('Select date'),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible(),

                Section::make('Contact Information')
                    ->description('Email and phone contact details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('email')
                                    ->label('Email Address')
                                    ->email()
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->placeholder('user@example.com'),

                                TextInput::make('phone')
                                    ->label('Phone Number')
                                    ->tel()
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->placeholder('+234 XXX XXX XXXX'),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible(),

                Section::make('Account Settings')
                    ->description('Role, referral, and account status')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('role')
                                    ->label('User Role')
                                    ->options([
                                        'user' => 'User',
                                        'admin' => 'Administrator',
                                    ])
                                    ->default('user')
                                    ->required()
                                    ->native(false),

                                TextInput::make('referral_id')
                                    ->label('Referral ID')
                                    ->disabled()
                                    ->dehydrated()
                                    ->placeholder('Auto-generated')
                                    ->helperText('Automatically generated on creation'),

                    TextInput::make('referral_points')
                        ->label('Referral Points')
                        ->numeric()
                        ->default(0)
                        ->disabled()
                        ->helperText('Points earned from referrals'),

                    Toggle::make('registration_paid')
                                    ->label('Registration Paid')
                                    ->default(false)
                                    ->inline(false)
                                    ->helperText('Has the user completed registration payment?'),
                            ]),

                        Grid::make(2)
                            ->schema([
                                DateTimePicker::make('plan_start_date')
                                    ->label('Plan Start Date')
                                    ->native(false)
                                    ->displayFormat('d/m/Y H:i')
                                    ->placeholder('Select date and time'),

                                DateTimePicker::make('last_activity')
                                    ->label('Last Activity')
                                    ->disabled()
                                    ->placeholder('Auto-tracked'),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible(),

                Section::make('Security')
                    ->description('Password and authentication settings')
                    ->schema([
                        TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->dehydrateStateUsing(fn($state) => Hash::make($state))
                            ->dehydrated(fn($state) => filled($state))
                            ->required(fn(string $context): bool => $context === 'create')
                            ->minLength(8)
                            ->placeholder('Enter password')
                            ->helperText('Minimum 8 characters'),

                        DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->native(false)
                            ->displayFormat('d/m/Y H:i')
                            ->placeholder('Not verified')
                            ->helperText('Leave empty if not verified'),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('Notification Preferences')
                    ->description('Configure notification and communication preferences')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Toggle::make('email_notifications')
                                    ->label('Email Notifications')
                                    ->default(true)
                                    ->inline(false)
                                    ->helperText('Receive general emails'),

                                Toggle::make('sms_notifications')
                                    ->label('SMS Notifications')
                                    ->default(true)
                                    ->inline(false)
                                    ->helperText('Receive SMS messages'),

                                Toggle::make('transaction_alerts')
                                    ->label('Transaction Alerts')
                                    ->default(true)
                                    ->inline(false)
                                    ->helperText('Get alerts for transactions'),

                                Toggle::make('marketing_emails')
                                    ->label('Marketing Emails')
                                    ->default(false)
                                    ->inline(false)
                                    ->helperText('Receive promotional content'),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
