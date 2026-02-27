<?php

namespace App\Jobs;

use App\Models\DistributionLog;
use App\Models\User;
use App\Services\DistributionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessMonthlyDistribution implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public int $timeout = 120;

    public function __construct(
        public int $userId,
        public string $month,
    ) {}

    public function handle(DistributionService $distributionService): void
    {
        // No early idempotency skip — the service itself checks per-account
        $user = User::find($this->userId);

        if (!$user) {
            Log::warning("User {$this->userId} not found for distribution");
            return;
        }

        try {
            $distributionService->distributeForUser($user, $this->month);
        } catch (\Throwable $e) {
            Log::error("Distribution failed for user {$this->userId}", [
                'month' => $this->month,
                'error' => $e->getMessage(),
            ]);

            // Record failure in distribution log
            DistributionLog::updateOrCreate(
                ['user_id' => $this->userId, 'month' => $this->month],
                ['status' => 'failed', 'error_message' => $e->getMessage()]
            );

            throw $e;
        }
    }

    /**
     * Non-unique: the same user+month may run multiple times
     * to distribute to newly created accounts. Idempotency is
     * handled per-account inside DistributionService.
     */
}
