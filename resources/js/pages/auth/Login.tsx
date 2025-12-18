import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-pink-50">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 -left-4 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute top-40 right-20 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl" />
                    <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl" />
                </div>

                {/* Left Side - Enhanced Branding */}
                <div className="relative hidden w-1/2 overflow-hidden bg-blue-800 p-12 lg:flex lg:flex-col lg:justify-between">
                    {/* Decorative Pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                backgroundSize: '40px 40px',
                            }}
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                            <span className="text-sm font-medium text-white">
                                Trusted by 10,000+ Users
                            </span>
                        </div>
                        <h1 className="mb-3 text-5xl font-bold text-white">
                            MightyShare
                        </h1>
                        <p className="text-xl text-blue-100">
                            Your Trusted Thrift Partner
                        </p>
                    </div>

                    <div className="relative z-10 space-y-8">
                        {/* Feature Cards */}
                        <div className="space-y-4">
                            <div className="group rounded-2xl border border-blue-400/30 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 p-3">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        High Returns
                                    </h3>
                                </div>
                                <p className="text-blue-100">
                                    Earn returns on your
                                    savings with our premium packages
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-blue-400/30 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-3">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        100% Secure
                                    </h3>
                                </div>
                                <p className="text-blue-100">
                                    Bank-level security with full insurance
                                    coverage on all deposits
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { value: '10K+', label: 'Active Members' },
                                { value: '₦2B+', label: 'Total Savings' },
                                { value: '99%', label: 'Satisfaction' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-transform hover:scale-105"
                                >
                                    <p className="mb-1 text-3xl font-bold text-white">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-blue-200">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200">
                        © 2025 MightyShare. All rights reserved.
                    </p>
                </div>

                {/* Right Side - Enhanced Login Form */}
                <div className="relative flex w-full items-center justify-center md:p-8 lg:w-1/2">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="mb-10 text-center lg:hidden">
                            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                                MightyShare
                            </h1>
                            <p className="text-gray-600">
                                Your Trusted Thrift Partner
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8">
                            {/* Form Header */}
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    Welcome Back! 👋
                                </h2>
                                <p className="text-gray-600">
                                    Sign in to continue your savings journey
                                </p>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-12 text-gray-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-12 pl-12 text-gray-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    'remember',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            Remember me
                                        </span>
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {processing
                                            ? 'Signing in...'
                                            : 'Sign In'}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-8 flex items-center">
                                <div className="flex-1 border-t border-gray-300" />
                                <span className="px-4 text-sm font-medium text-gray-500">
                                    Or continue with
                                </span>
                                <div className="flex-1 border-t border-gray-300" />
                            </div>

                            {/* Social Login Buttons */}
                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Sign up for free →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
