<?php

namespace App\Filament\Resources\Contacts\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class ContactForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('Full Name'),

                TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->placeholder('Email Address'),

                TextInput::make('phone')
                    ->tel()
                    ->maxLength(20)
                    ->placeholder('Phone Number (Optional)'),

                Textarea::make('message')
                    ->required()
                    ->minLength(10)
                    ->maxLength(5000)
                    ->rows(6)
                    ->placeholder('Your message...'),

                Select::make('status')
                    ->options([
                        'new' => 'New',
                        'read' => 'Read',
                        'responded' => 'Responded',
                    ])
                    ->default('new')
                    ->required(),
            ]);
    }
}
