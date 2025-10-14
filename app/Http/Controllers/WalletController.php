<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('wallet/Wallet');
    }
}
