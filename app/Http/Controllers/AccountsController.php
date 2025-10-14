<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AccountsController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('accounts/Add');
    }
}
