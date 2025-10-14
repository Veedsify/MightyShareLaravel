<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('notifications/Notifications');
    }
}
