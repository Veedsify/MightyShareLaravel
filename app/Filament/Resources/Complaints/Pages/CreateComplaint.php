<?php

namespace App\Filament\Resources\Complaints\Pages;

use App\Filament\Resources\Complaints\ComplaintResource;
use App\Models\Complaint;
use Filament\Resources\Pages\CreateRecord;

class CreateComplaint extends CreateRecord
{
      protected static string $resource = ComplaintResource::class;

      protected function mutateFormDataBeforeCreate(array $data): array
      {
            $data['ticket_number'] = Complaint::generateTicketNumber();
            return $data;
      }
}
