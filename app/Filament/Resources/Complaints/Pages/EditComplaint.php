<?php

namespace App\Filament\Resources\Complaints\Pages;

use App\Filament\Resources\Complaints\ComplaintResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditComplaint extends EditRecord
{
      protected static string $resource = ComplaintResource::class;

      protected function getHeaderActions(): array
      {
            return [
                  Actions\ViewAction::make(),
                  Actions\DeleteAction::make(),
            ];
      }
}
