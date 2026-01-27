<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PhoneService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserRegistrationRequest;
use App\Services\UserRegistrationService;
use App\Models\ThriftPackage;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    public function loginPage()
    {
        return inertia('auth/Login');
    }
    public function registerPage(Request $request)
    {
        $packageId = $request->input('package') ?? null;
        if ($packageId) {
            $package = ThriftPackage::find($packageId);
            if (!$package) {
                return redirect()->route('register')->with('error', 'Selected package does not exist');
            }
        }

        // Load ThriftPackages for the registration form
        $packages = ThriftPackage::where('is_active', true)->get()->map(function ($package) {
            return [
                'id' => $package->id,
                'name' => $package->name,
                'price' => $package->price,
                'duration' => $package->duration,
                'profitPercentage' => $package->profit_percentage,
                'description' => $package->description,
                'features' => $package->features,
                'terms' => $package->terms,
                'isActive' => $package->is_active,
                'minContribution' => $package->min_contribution,
                'maxContribution' => $package->max_contribution,
            ];
        });

        return inertia('auth/Register', [
            'packages' => $packages,
            'packageId' => $packageId
        ]);
    }
    /**
     * Handle user registration
     *
     * @param UserRegistrationRequest $request
     * @param UserRegistrationService $registrationService
     * @return \Illuminate\Http\RedirectResponse
     */
    public function register(UserRegistrationRequest $request, UserRegistrationService $registrationService)
    {
        try {
            // Register the user using the service
            $user = $registrationService->register($request->validated());

            // Authenticate the user
            Auth::login($user);
            $request->session()->regenerate();

            // Redirect to register-payment page on successful registration
            return redirect()->route('register-payment')->with('success', 'Registration successful! Please complete your payment to activate your account.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Registration failed - Package not found', [
                'package_id' => $request->input('package_id'),
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'package_id' => 'Selected package does not exist'
            ])->withInput();
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate email error
            if ($e->getCode() === '23000') {
                Log::error('Registration failed - Duplicate email', [
                    'email' => $request->input('email'),
                    'error' => $e->getMessage()
                ]);

                return back()->withErrors([
                    'email' => 'Sorry this account already exists'
                ])->withInput();
            }

            Log::error('Registration failed - Database error', [
                'email' => $request->input('email'),
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'general' => 'Registration failed. Please try again.'
            ])->withInput();
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'email' => $request->input('email'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Registration failed. Please try again.'
            ])->withInput();
        }
    }



    /**
     * Handle user login with email-based authentication
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        // Validate the request
        $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $credentials = $request->only('phone', 'password');

        $user = PhoneService::findUser($credentials['phone']);

        if(!$user) {
            return back()->withErrors([
                'phone' => 'User not found'
            ])->onlyInput('phone');
        }

        $verifyMatch = password_verify($credentials['password'], $user->password);


        if ($verifyMatch) {
            Auth::login($user);
            $request->session()->regenerate();

            if (Auth::user()->isAdmin()) {
                redirect('/admin')->with('success', 'Login successful!');
            }

            // Redirect to dashboard on successful login
            return redirect()->intended('dashboard')->with('success', 'Login successful!');
        }

        // Authentication failed - return with error
        return back()->withErrors([
            'email' => 'Invalid credentials. Please check your email and password.',
        ])->onlyInput('email');
    }

    /**
     * Handle user logout
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Logged out successfully');
    }
}
