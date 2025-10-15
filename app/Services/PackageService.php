<?php

namespace App\Services;

use App\Models\ThriftPackage;
use Illuminate\Support\Facades\Auth;

class PackageService
{
    public function getAllPackages()
    {
        return ThriftPackage::all();
    }

    public function getPackageById($id)
    {
        return ThriftPackage::find($id);
    }

    public function getMySubscriptions()
    {
      /**  @var \App\Models\User $user */
        return Auth::user()->thriftSubscriptions()->with('package')->get();
    }
}