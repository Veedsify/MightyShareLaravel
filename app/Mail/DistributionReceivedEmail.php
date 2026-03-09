<?php

namespace App\Mail;

use App\Models\ThriftPackage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DistributionReceivedEmail extends Mailable implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $user;
    public $package;
    public $totalDistributed;
    public $accountsProcessed;
    public $month;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param ThriftPackage $package
     * @param float $totalDistributed
     * @param int $accountsProcessed
     * @param string $month
     */
    public function __construct(User $user, ThriftPackage $package, $totalDistributed, $accountsProcessed, $month)
    {
        $this->user = $user;
        $this->package = $package;
        $this->totalDistributed = $totalDistributed;
        $this->accountsProcessed = $accountsProcessed;
        $this->month = $month;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Monthly Share Received for {$this->month} - MightyShare")
                    ->view('emails.distribution-received');
    }
}
