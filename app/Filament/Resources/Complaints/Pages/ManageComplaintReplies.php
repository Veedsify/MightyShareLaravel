<?php

namespace App\Filament\Resources\Complaints\Pages;

use App\Filament\Resources\Complaints\ComplaintResource;
use App\Models\ComplaintReply;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Auth;

class ManageComplaintReplies extends ViewRecord
{
      protected static string $resource = ComplaintResource::class;

      protected string $view = 'filament.resources.complaints.pages.manage-complaint-replies';

      public ?string $replyMessage = null;

      public string $replyType = 'reply';

      public function getTitle(): string
      {
            return 'Manage Replies - ' . ($this->record?->ticket_number ?? 'Complaint');
      }

      protected function getHeaderActions(): array
      {
            return [
                  Actions\Action::make('back')
                        ->label('Back to Complaints')
                        ->url(ComplaintResource::getUrl('index'))
                        ->button(),
            ];
      }

      public function addReply(): void
      {
            if (!$this->record || !$this->replyMessage) {
                  Notification::make()
                        ->title('Error')
                        ->body('Please enter a message')
                        ->danger()
                        ->send();
                  return;
            }

            ComplaintReply::create([
                  'complaint_id' => $this->record->id,
                  'user_id' => Auth::id(),
                  'message' => $this->replyMessage,
                  'type' => $this->replyType,
            ]);

            $this->replyMessage = null;
            $this->replyType = 'reply';
            $this->record = $this->record->fresh();

            Notification::make()
                  ->title('Success')
                  ->body('Reply added successfully')
                  ->success()
                  ->send();
      }
}
