<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ComplaintsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('complaints/Complaints');
    }
}
