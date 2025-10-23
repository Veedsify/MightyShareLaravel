<?php

namespace App\Filament\Resources\Complaints;

use App\Filament\Resources\Complaints\Pages\CreateComplaint;
use App\Filament\Resources\Complaints\Pages\EditComplaint;
use App\Filament\Resources\Complaints\Pages\ListComplaints;
use App\Filament\Resources\Complaints\Pages\ManageComplaintReplies;
use App\Filament\Resources\Complaints\Pages\ViewComplaint;
use App\Filament\Resources\Complaints\Schemas\ComplaintForm;
use App\Filament\Resources\Complaints\Schemas\ComplaintInfolist;
use App\Filament\Resources\Complaints\Tables\ComplaintsTable;
use App\Models\Complaint;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ComplaintResource extends Resource
{
      protected static ?string $model = Complaint::class;

      protected static string|BackedEnum|null $navigationIcon = Heroicon::InformationCircle;
      protected static string|UnitEnum|null $navigationGroup = "Support";

      protected static ?string $recordTitleAttribute = 'ticket_number';

      public static function form(Schema $schema): Schema
      {
            return ComplaintForm::configure($schema);
      }

      public static function infolist(Schema $schema): Schema
      {
            return ComplaintInfolist::configure($schema);
      }

      public static function table(Table $table): Table
      {
            return ComplaintsTable::configure($table);
      }

      public static function getRelations(): array
      {
            return [
                  //
            ];
      }

      public static function getPages(): array
      {
            return [
                  'index' => ListComplaints::route('/'),
                  'create' => CreateComplaint::route('/create'),
                  'view' => ViewComplaint::route('/{record}'),
                  'edit' => EditComplaint::route('/{record}/edit'),
                  'manageReplies' => ManageComplaintReplies::route('/{record}/replies'),
            ];
      }

      public static function getNavigationBadge(): ?string
      {
            return static::getModel()::where('status', 'open')->count();
      }

      public static function getNavigationBadgeTooltip(): ?string
      {
            return 'Open complaints';
      }
}
