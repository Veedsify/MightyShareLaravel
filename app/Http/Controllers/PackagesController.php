<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PackagesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('packages/Packages');
    }

    public function mySubscriptions(): Response
    {
        return Inertia::render('packages/MySubscriptions');
    }
}
