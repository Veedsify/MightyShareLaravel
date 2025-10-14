<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SettlementsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('settlements/Settlements');
    }

    public function dueForClearance(): Response
    {
        return Inertia::render('settlements/DueForClearance');
    }

    public function allPaidAccounts(): Response
    {
        return Inertia::render('settlements/AllPaidAccounts');
    }

    public function requestBulkWithdrawal(): Response
    {
        return Inertia::render('settlements/RequestBulkWithdrawal');
    }

    public function nextSettlement(): Response
    {
        return Inertia::render('settlements/NextSettlement');
    }
}
