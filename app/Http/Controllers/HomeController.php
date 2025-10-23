<?php

namespace App\Http\Controllers;

use App\Models\ThriftPackage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $packages = ThriftPackage::where('is_active', true)
            ->get()
            ->map(fn($package) => $package->toApiArray());

        return Inertia::render('home/Home', [
            'thriftPackages' => $packages,
        ]);
    }
}
