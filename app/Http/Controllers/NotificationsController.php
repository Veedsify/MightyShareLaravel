<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $notifications = $user->userNotifications()
            ->with(['thriftPackage'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return $notification->toApiArray();
            });

        return Inertia::render('notifications/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user();

        $notification = $user->userNotifications()->find($id);

        if (!$notification) {
            return back()->with('error', 'Notification not found');
        }

        $user->userNotifications()->updateExistingPivot($id, [
            'read' => true,
            'read_at' => now(),
        ]);

        return back()->with('success', 'Notification marked as read');
    }

    public function markAllAsRead()
    {
        $user = Auth::user();

        $user->userNotifications()
            ->wherePivot('read', false)
            ->get()
            ->each(function ($notification) use ($user) {
                $user->userNotifications()->updateExistingPivot($notification->id, [
                    'read' => true,
                    'read_at' => now(),
                ]);
            });

        return back()->with('success', 'All notifications marked as read');
    }
}
