<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeductionNotificationEmail extends Mailable implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $user;
    public $amount;
    public $description;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param float $amount
     * @param string $description
     */
    public function __construct(User $user, $amount, $description)
    {
        $this->user = $user;
        $this->amount = $amount;
        $this->description = $description;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Account Deduction Notification - MightyShare')
                    ->view('emails.deduction-notification');
    }
}
