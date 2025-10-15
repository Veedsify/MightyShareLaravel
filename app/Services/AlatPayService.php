<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\Response;

class AlatPayService
{
    private const BASE_URL = 'https://apibox.alatpay.ng';
    private const BUSINESS_ID = '27a4ed9c-e6db-490e-1495-08ddfceabbff';

    private string $secretKey;

    public function __construct()
{
        $this->secretKey = config('services.alatpay.public_key');

        if (!$this->secretKey) {
            throw new \Exception('AlatPay secret key is not configured');
        }
    }

    /**
     * Generate virtual bank account for payment
     */
    public function generateVirtualAccount(
        string $orderId,
        int $amount,
        string $description,
        User $user
    ): array {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Ocp-Apim-Subscription-Key' => $this->secretKey,
            ])->post(self::BASE_URL . '/bank-transfer/api/v1/bankTransfer/virtualAccount', [
                'businessId' => self::BUSINESS_ID,
                'amount' => $amount,
                'currency' => 'NGN',
                'orderId' => $orderId,
                'description' => $description,
                'customer' => [
                    'email' => $this->generateCustomerEmail($user),
                    'phone' => $user->phone,
                    'firstName' => $this->getFirstName($user->name),
                    'lastName' => $this->getLastName($user->name),
                    'metadata' => json_encode([
                        'OtherName' => $user->name,
                    ]),
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($data['status'] ?? false) {
                    return [
                        'success' => true,
                        'data' => $data
                    ];
                } else {
                    return [
                        'success' => false,
                        'error' => $data['message'] ?? 'AlatPay Failed To Initialize',
                        'details' => $data
                    ];
                }
            } else {
                Log::error('AlatPay virtual account API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return [
                    'success' => false,
                    'error' => 'Payment initialization failed',
                    'details' => $response->json()
                ];
            }
        } catch (\Exception $e) {
            Log::error('AlatPay virtual account generation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Payment service error',
                'details' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify payment status with AlatPay
     */
    public function verifyPayment(string $transactionId): array
    {
        try {
            $verifyUrl = self::BASE_URL . "/bank-transfer/api/v1/bankTransfer/transactions/{$transactionId}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Ocp-Apim-Subscription-Key' => $this->secretKey,
            ])->get($verifyUrl);

            if ($response->successful()) {
                $responseData = $response->json();

                if (
                    ($responseData['status'] ?? false) &&
                    ($responseData['data']['status'] ?? '') === 'completed'
                ) {
                    return [
                        'success' => true,
                        'data' => $responseData['data']
                    ];
                } else {
                    return [
                        'success' => false,
                        'error' => $responseData['message'] ?? 'Payment verification failed',
                        'details' => $responseData
                    ];
                }
            } else {
                Log::error('AlatPay verify API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return [
                    'success' => false,
                    'error' => 'Could not verify payment with AlatPay',
                    'details' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('AlatPay payment verification error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Payment verification service error',
                'details' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify payment using alternative API endpoint
     */
    public function verifyPaymentAlternative(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get("https://api.alatpay.com/checkout/verify/{$reference}");

            if ($response->successful()) {
                $verifyData = $response->json();

                if (($verifyData['data']['status'] ?? '') === 'success') {
                    return [
                        'success' => true,
                        'data' => $verifyData['data']
                    ];
                } else {
                    return [
                        'success' => false,
                        'error' => 'Payment not successful',
                        'details' => $verifyData
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'error' => 'Payment verification failed',
                    'details' => $response->body()
                ];
            }
        } catch (\Exception $e) {
            Log::error('AlatPay alternative verification error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Payment verification service error',
                'details' => $e->getMessage()
            ];
        }
    }

    /**
     * Format API response for frontend consumption
     */
    public function formatResponse(array $data, bool $success = true): array
    {
        if ($success) {
            return [
                'success' => true,
                'data' => $data
            ];
        } else {
            return [
                'success' => false,
                'error' => $data['error'] ?? 'Unknown error',
                'details' => $data['details'] ?? null
            ];
        }
    }

    /**
     * Validate environment configuration
     */
    public function validateConfiguration(): bool
    {
        return !empty($this->secretKey) &&
            !empty(config('services.alatpay.public_key')) &&
            !empty(config('services.alatpay.business_id'));
    }

    /**
     * Get configuration status for debugging
     */
    public function getConfigurationStatus(): array
    {
        return [
            'secret_key_configured' => !empty($this->secretKey),
            'public_key_configured' => !empty(config('services.alatpay.public_key')),
            'business_id_configured' => !empty(config('services.alatpay.business_id')),
            'base_url' => config('services.alatpay.base_url', self::BASE_URL),
            'business_id' => config('services.alatpay.business_id', self::BUSINESS_ID),
        ];
    }

    /**
     * Generate customer email for AlatPay
     */
    private function generateCustomerEmail(User $user): string
    {
        $firstName = $this->getFirstName($user->name);
        return "{$firstName}-{$user->phone}@mightyshare.com";
    }

    /**
     * Get first name from full name
     */
    private function getFirstName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return $parts[0] ?? $fullName;
    }

    /**
     * Get last name from full name
     */
    private function getLastName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return $parts[1] ?? $fullName;
    }

    /**
     * Handle API errors and format them consistently
     */
    private function handleApiError(Response $response, string $operation): array
    {
        $statusCode = $response->status();
        $body = $response->body();

        Log::error("AlatPay {$operation} API error", [
            'status' => $statusCode,
            'body' => $body
        ]);

        $errorData = $response->json();

        return [
            'success' => false,
            'error' => $errorData['message'] ?? "AlatPay {$operation} failed",
            'details' => $errorData,
            'status_code' => $statusCode
        ];
    }

    /**
     * Log API request for debugging
     */
    private function logApiRequest(string $method, string $url, array $data = []): void
    {
        Log::info('AlatPay API Request', [
            'method' => $method,
            'url' => $url,
            'data' => $data
        ]);
    }

    /**
     * Log API response for debugging
     */
    private function logApiResponse(string $operation, Response $response): void
    {
        Log::info("AlatPay {$operation} API Response", [
            'status' => $response->status(),
            'body' => $response->json()
        ]);
    }
}
