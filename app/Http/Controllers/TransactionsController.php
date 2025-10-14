<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class TransactionsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('transactions/Transactions');
    }
}
