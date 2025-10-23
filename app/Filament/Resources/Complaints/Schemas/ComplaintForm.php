<?php

namespace App\Filament\Resources\Complaints\Schemas;

use App\Models\User;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ComplaintForm
{
      public static function configure(Schema $schema): Schema
      {
            return $schema
                  ->components([
                        Section::make('Complaint Details')
                              ->schema([
                                    TextInput::make('title')
                                          ->required()
                                          ->maxLength(255)
                                          ->columnSpanFull(),

                                    Textarea::make('description')
                                          ->required()
                                          ->rows(5)
                                          ->columnSpanFull(),

                                    Select::make('category')
                                          ->options([
                                                'account' => 'Account',
                                                'transaction' => 'Transaction',
                                                'service' => 'Service',
                                                'other' => 'Other',
                                          ])
                                          ->required(),

                                    Select::make('priority')
                                          ->options([
                                                'low' => 'Low',
                                                'normal' => 'Normal',
                                                'high' => 'High',
                                                'urgent' => 'Urgent',
                                          ])
                                          ->default('normal')
                                          ->required(),
                              ]),

                        Section::make('Status & Resolution')
                              ->schema([
                                    Select::make('status')
                                          ->options([
                                                'open' => 'Open',
                                                'in_progress' => 'In Progress',
                                                'resolved' => 'Resolved',
                                                'closed' => 'Closed',
                                          ])
                                          ->required()
                                          ->default('open'),

                                    Textarea::make('resolution')
                                          ->label('Resolution Notes')
                                          ->rows(4)
                                          ->columnSpanFull(),

                                    DateTimePicker::make('resolved_at')
                                          ->timezone('Africa/Lagos')
                                          ->seconds(false),
                              ]),

                        Section::make('User Information')
                              ->schema([
                                    Select::make('user_id')
                                          ->label('User')
                                          ->options(User::all()->pluck('name', 'id'))
                                          ->searchable()
                                          ->required(),
                              ]),
                  ]);
      }
}
