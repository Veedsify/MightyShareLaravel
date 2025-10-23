<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
      public function search(string $query): JsonResponse
      {
            if (strlen($query) < 2) {
                  return response()->json([
                        'transactions' => [],
                        'pages' => [],
                  ]);
            }

            $user = Auth::user();
            $query = trim($query);

            // Search transactions
            $transactions = $user->payments()
                  ->where(function ($q) use ($query) {
                        $q->where('order_id', 'like', "%{$query}%")
                              ->orWhere('description', 'like', "%{$query}%");
                  })
                  ->orderByDesc('created_at')
                  ->limit(5)
                  ->get()
                  ->map(fn($payment) => [
                        'id' => $payment->id,
                        'type' => 'transaction',
                        'title' => $payment->order_id ?? "Payment #{$payment->id}",
                        'subtitle' => $payment->description,
                        'url' => '/dashboard/transactions',
                        'amount' => '₦' . number_format($payment->amount),
                        'date' => $payment->created_at?->format('M d, Y'),
                  ]);

            // Search pages - static navigation items
            $pages = $this->searchPages($query);

            return response()->json([
                  'transactions' => $transactions,
                  'pages' => $pages,
            ]);
      }

      private function searchPages(string $query): array
      {
            $navigationItems = [
                  ['title' => 'Dashboard', 'url' => '/dashboard', 'icon' => 'Home'],
                  ['title' => 'Add Account', 'url' => '/dashboard/accounts/add', 'icon' => 'UserPlus'],
                  ['title' => 'Wallet', 'url' => '/dashboard/wallet', 'icon' => 'Wallet'],
                  ['title' => 'Transactions', 'url' => '/dashboard/transactions', 'icon' => 'Receipt'],
                  ['title' => 'Due for Clearance', 'url' => '/dashboard/settlements/due-for-clearance', 'icon' => 'CheckCircle'],
                  ['title' => 'All Paid Accounts', 'url' => '/dashboard/settlements/all-paid-accounts', 'icon' => 'CheckCircle'],
                  ['title' => 'Request Bulk Withdrawal', 'url' => '/dashboard/settlements/request-bulk-withdrawal', 'icon' => 'CheckCircle'],
                  ['title' => 'Next Settlement', 'url' => '/dashboard/settlements/next-settlement', 'icon' => 'CheckCircle'],
                  ['title' => 'Thrift Packages', 'url' => '/dashboard/packages', 'icon' => 'Package'],
                  ['title' => 'My Subscriptions', 'url' => '/dashboard/packages/my-subscriptions', 'icon' => 'Package'],
                  ['title' => 'Complaints', 'url' => '/dashboard/complaints', 'icon' => 'MessageSquare'],
                  ['title' => 'Notifications', 'url' => '/dashboard/notifications', 'icon' => 'Bell'],
                  ['title' => 'Profile', 'url' => '/dashboard/settings', 'icon' => 'User'],
            ];

            $lowerQuery = strtolower($query);

            return array_values(array_filter(
                  array_map(
                        fn($item) =>
                        stripos($item['title'], $query) !== false ? [
                              'type' => 'page',
                              'title' => $item['title'],
                              'url' => $item['url'],
                              'icon' => $item['icon'],
                        ] : null,
                        $navigationItems
                  ),
                  fn($item) => $item !== null
            ));
      }
}
