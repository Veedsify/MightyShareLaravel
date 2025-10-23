<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Overview')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Full Name')
                                    ->weight(FontWeight::Bold)
                                    ->icon('heroicon-o-user')
                                    ->iconColor('primary'),

                                TextEntry::make('role')
                                    ->label('Role')
                                    ->badge()
                                    ->colors([
                                        'danger' => 'admin',
                                        'success' => 'user',
                                    ])
                                    ->icons([
                                        'heroicon-o-shield-check' => 'admin',
                                        'heroicon-o-user' => 'user',
                                    ]),
                            ]),
                    ])
                    ->columnSpan(2),

                Section::make('Contact Information')
                    ->schema([
                        TextEntry::make('email')
                            ->label('Email Address')
                            ->icon('heroicon-o-envelope')
                            ->iconColor('primary')
                            ->copyable()
                            ->copyMessage('Email copied!')
                            ->copyMessageDuration(1500),

                        TextEntry::make('phone')
                            ->label('Phone Number')
                            ->icon('heroicon-o-phone')
                            ->iconColor('success')
                            ->copyable()
                            ->copyMessage('Phone copied!')
                            ->copyMessageDuration(1500),

                        TextEntry::make('email_verified_at')
                            ->label('Email Verified')
                            ->dateTime('d F Y, H:i')
                            ->placeholder('Not verified')
                            ->icon('heroicon-o-check-badge')
                            ->iconColor(fn($state) => $state ? 'success' : 'danger')
                            ->color(fn($state) => $state ? 'success' : 'danger'),
                    ])
                    ->columns(3)
                    ->collapsible(),

                Section::make('Account Details')
                    ->schema([
                        TextEntry::make('referral_id')
                            ->label('Referral ID')
                            ->icon('heroicon-o-ticket')
                            ->iconColor('warning')
                            ->copyable()
                            ->copyMessage('Referral ID copied!')
                            ->placeholder('Not generated'),

                        IconEntry::make('registration_paid')
                            ->label('Registration Status')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('danger'),

                        TextEntry::make('plan_start_date')
                            ->label('Plan Start Date')
                            ->dateTime('d F Y')
                            ->placeholder('No plan started')
                            ->icon('heroicon-o-calendar'),

                        TextEntry::make('date_of_birth')
                            ->label('Date of Birth')
                            ->date('d F Y')
                            ->placeholder('Not provided')
                            ->icon('heroicon-o-cake'),
                    ])
                    ->columns(4)
                    ->collapsible(),

                Section::make('Activity & Statistics')
                    ->schema([
                        TextEntry::make('last_activity')
                            ->label('Last Activity')
                            ->dateTime('d F Y, H:i')
                            ->placeholder('Never')
                            ->since()
                            ->icon('heroicon-o-clock'),

                        TextEntry::make('created_at')
                            ->label('Member Since')
                            ->dateTime('d F Y')
                            ->since()
                            ->icon('heroicon-o-calendar-days'),

                        TextEntry::make('updated_at')
                            ->label('Last Updated')
                            ->dateTime('d F Y, H:i')
                            ->since()
                            ->icon('heroicon-o-arrow-path'),
                    ])
                    ->columns(3)
                    ->collapsible(),

                Section::make('Notification Preferences')
                    ->schema([
                        IconEntry::make('email_notifications')
                            ->label('Email Notifications')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('gray'),

                        IconEntry::make('sms_notifications')
                            ->label('SMS Notifications')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('gray'),

                        IconEntry::make('transaction_alerts')
                            ->label('Transaction Alerts')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('gray'),

                        IconEntry::make('marketing_emails')
                            ->label('Marketing Emails')
                            ->boolean()
                            ->trueIcon('heroicon-o-check-circle')
                            ->falseIcon('heroicon-o-x-circle')
                            ->trueColor('success')
                            ->falseColor('gray'),
                    ])
                    ->columns(4)
                    ->collapsible()
                    ->collapsed(),

                Section::make('Relationship Counts')
                    ->schema([
                        TextEntry::make('accounts_count')
                            ->label('Total Accounts')
                            ->state(fn($record) => $record->accounts()->count())
                            ->badge()
                            ->color('info')
                            ->icon('heroicon-o-wallet'),

                        TextEntry::make('payments_count')
                            ->label('Total Payments')
                            ->state(fn($record) => $record->payments()->count())
                            ->badge()
                            ->color('success')
                            ->icon('heroicon-o-banknotes'),

                        TextEntry::make('thrift_subscriptions_count')
                            ->label('Subscriptions')
                            ->state(fn($record) => $record->thriftSubscriptions()->count())
                            ->badge()
                            ->color('primary')
                            ->icon('heroicon-o-gift'),

                        TextEntry::make('complaints_count')
                            ->label('Complaints')
                            ->state(fn($record) => $record->complaints()->count())
                            ->badge()
                            ->color(fn($state) => $state > 0 ? 'warning' : 'gray')
                            ->icon('heroicon-o-chat-bubble-left-right'),

                        TextEntry::make('settlement_accounts_count')
                            ->label('Settlements')
                            ->state(fn($record) => $record->settlementAccounts()->count())
                            ->badge()
                            ->color('warning')
                            ->icon('heroicon-o-currency-dollar'),
                    ])
                    ->columns(5)
                    ->collapsible(),
            ]);
    }
}
