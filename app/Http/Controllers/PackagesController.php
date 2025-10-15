<?php

namespace App\Http\Controllers;

use App\Models\ThriftPackage;
use App\Services\PackageService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PackagesController extends Controller
{

    private PackageService $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index(): Response
    {
        $packages = $this->packageService->getAllPackages();
        $mySubscriptions = $this->packageService->getMySubscriptions();
        Log::info('My Subscriptions:', ['subscriptions' => $mySubscriptions]);
        
        return Inertia::render('packages/Packages',[
            'packages' => $packages,
            'mySubscriptions' => $mySubscriptions,
        ]);
    }

    public function mySubscriptions(): Response
    {
        return Inertia::render('packages/MySubscriptions');
    }
}
