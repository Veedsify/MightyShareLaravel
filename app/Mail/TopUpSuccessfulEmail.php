<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TopUpSuccessfulEmail extends Mailable implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $user;
    public $transaction;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param Transaction $transaction
     */
    public function __construct(User $user, Transaction $transaction)
    {
        $this->user = $user;
        $this->transaction = $transaction;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Top-up Successful - MightyShare')
                    ->view('emails.topup-successful');
    }
}
