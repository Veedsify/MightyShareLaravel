import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Check,
    ChevronDown,
    Crown,
    Eye,
    EyeOff,
    Gem,
    Lock,
    Mail,
    Medal,
    Package,
    Phone,
    Sparkles,
    User,
} from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

const packageOptions = [
    {
        value: 'bronze',
        label: 'Bronze Package',
        description: '₦10,000 - ₦100,000 • 5% Returns • 3 Months',
        color: 'from-orange-400 to-orange-600',
        icon: Award,
    },
    {
        value: 'silver',
        label: 'Silver Package',
        description: '₦100,000 - ₦500,000 • 8% Returns • 6 Months',
        color: 'from-gray-400 to-gray-600',
        icon: Medal,
    },
    {
        value: 'gold',
        label: 'Gold Package',
        description: '₦500,000 - ₦1,000,000 • 12% Returns • 6 Months',
        color: 'from-yellow-400 to-yellow-600',
        icon: Crown,
    },
    {
        value: 'platinum',
        label: 'Platinum Package',
        description: '₦1,000,000+ • 15% Returns • 12 Months',
        color: 'from-purple-400 to-purple-600',
        icon: Gem,
    },
];

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        package: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsPackageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    const selectedPackage = packageOptions.find(
        (pkg) => pkg.value === data.package,
    );

    return (
        <>
            <Head title="Sign Up" />
            <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 -right-4 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute top-40 left-20 h-96 w-96 animate-pulse rounded-full bg-indigo-400/20 blur-3xl" />
                    <div className="absolute right-1/3 bottom-20 h-80 w-80 animate-pulse rounded-full bg-cyan-400/20 blur-3xl" />
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
                                Join 10,000+ Savers
                            </span>
                        </div>
                        <h1 className="mb-3 text-5xl font-bold text-white">
                            MightyShare
                        </h1>
                        <p className="text-xl text-blue-100">
                            Start Your Savings Journey Today
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Benefits List */}
                        <div className="rounded-2xl border border-blue-400/30 bg-white/10 p-6 backdrop-blur-md">
                            <h3 className="mb-4 text-xl font-bold text-white">
                                Why Choose MightyShare?
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Secure and regulated platform',
                                    'Flexible packages for all budgets',
                                    'Up to 15% annual returns',
                                    '24/7 customer support',
                                    'Easy withdrawals anytime',
                                ].map((benefit, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-blue-100"
                                    >
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Trust Indicators */}
                        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                            <p className="mb-4 text-sm font-medium text-blue-100">
                                Trusted by thousands
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-gradient-to-br from-blue-300 to-blue-400 text-sm font-bold text-blue-800"
                                        >
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        10K+
                                    </p>
                                    <p className="text-xs text-blue-200">
                                        Active Members
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200">
                        © 2025 MightyShare. All rights reserved.
                    </p>
                </div>

                {/* Right Side - Enhanced Register Form */}
                <div className="relative flex w-full items-center justify-center overflow-y-auto md:p-4 lg:w-1/2">
                    <div className="w-full max-w-md py-8">
                        {/* Mobile Logo */}
                        <div className="mb-10 text-center lg:hidden">
                            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                                MightyShare
                            </h1>
                            <p className="text-gray-600">
                                Start Your Savings Journey
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="w-full rounded-xl border border-gray-200 bg-white p-8">
                            {/* Form Header */}
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    Create Account 🚀
                                </h2>
                                <p className="text-gray-600">
                                    Join MightyShare and start saving today
                                </p>
                            </div>

                            {/* Register Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Full Name
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-12 text-gray-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
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

                                {/* Phone Number */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                                            <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-12 text-gray-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                            placeholder="+234 800 000 0000"
                                            required
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Package Selection */}
                                <div>
                                    <label
                                        htmlFor="package"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Select Your Package
                                    </label>

                                    {/* Custom Premium Dropdown */}
                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsPackageDropdownOpen(
                                                    !isPackageDropdownOpen,
                                                )
                                            }
                                            className="group relative w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-10 pl-12 text-left text-gray-900 transition-all outline-none hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        >
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus:text-blue-600">
                                                <Package
                                                    className={`h-5 w-5 transition-colors ${isPackageDropdownOpen || data.package ? 'text-blue-600' : 'text-gray-400'}`}
                                                />
                                            </div>

                                            <span
                                                className={
                                                    data.package
                                                        ? 'text-gray-900'
                                                        : 'text-gray-500'
                                                }
                                            >
                                                {selectedPackage ? (
                                                    <span className="flex items-center gap-2">
                                                        <selectedPackage.icon className="h-5 w-5" />
                                                        <span className="font-medium">
                                                            {
                                                                selectedPackage.label
                                                            }
                                                        </span>
                                                    </span>
                                                ) : (
                                                    'Choose a package...'
                                                )}
                                            </span>

                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown
                                                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isPackageDropdownOpen ? 'rotate-180 text-blue-600' : ''}`}
                                                />
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isPackageDropdownOpen && (
                                            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg duration-200 animate-in fade-in slide-in-from-top-2">
                                                <div className="max-h-80 overflow-y-auto p-2">
                                                    {packageOptions.map(
                                                        (pkg) => (
                                                            <button
                                                                key={pkg.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setData(
                                                                        'package',
                                                                        pkg.value,
                                                                    );
                                                                    setIsPackageDropdownOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                                className={`group relative w-full rounded-lg p-4 text-left transition-all duration-200 ${
                                                                    data.package ===
                                                                    pkg.value
                                                                        ? 'bg-gradient-to-r ' +
                                                                          pkg.color +
                                                                          ' text-white'
                                                                        : 'hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <div
                                                                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                                                                                data.package ===
                                                                                pkg.value
                                                                                    ? 'bg-white/20'
                                                                                    : 'bg-gradient-to-br ' +
                                                                                      pkg.color
                                                                            }`}
                                                                        >
                                                                            {data.package ===
                                                                            pkg.value ? (
                                                                                <Check className="h-6 w-6" />
                                                                            ) : (
                                                                                <pkg.icon className="h-6 w-6" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p
                                                                                className={`mb-1 font-bold ${data.package === pkg.value ? 'text-white' : 'text-gray-900'}`}
                                                                            >
                                                                                {
                                                                                    pkg.label
                                                                                }
                                                                            </p>
                                                                            <p
                                                                                className={`text-sm ${data.package === pkg.value ? 'text-white/90' : 'text-gray-600'}`}
                                                                            >
                                                                                {
                                                                                    pkg.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {data.package ===
                                                                        pkg.value && (
                                                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                                                                            <Check className="h-4 w-4 text-white" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Hover Glow Effect */}
                                                                {data.package !==
                                                                    pkg.value && (
                                                                    <div
                                                                        className={`absolute inset-0 -z-10 rounded-lg bg-gradient-to-r ${pkg.color} opacity-0 blur-xl transition-opacity group-hover:opacity-20`}
                                                                    />
                                                                )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Package Preview Card */}
                                    {selectedPackage && (
                                        <div
                                            className={`mt-3 overflow-hidden rounded-xl bg-gradient-to-r ${selectedPackage.color} p-[2px] duration-300 animate-in fade-in slide-in-from-top-1`}
                                        >
                                            <div className="rounded-[10px] bg-white p-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${selectedPackage.color}`}
                                                    >
                                                        <selectedPackage.icon className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 font-bold text-gray-900">
                                                            {
                                                                selectedPackage.label
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                selectedPackage.description
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                                                        <Check className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {errors.package && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.package}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
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

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
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
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms & Conditions */}
                                <div>
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            checked={data.terms}
                                            onChange={(e) =>
                                                setData(
                                                    'terms',
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500/20"
                                            required
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            I agree to the{' '}
                                            <Link
                                                href="/terms"
                                                className="font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Terms and Conditions
                                            </Link>{' '}
                                            and{' '}
                                            <Link
                                                href="/privacy"
                                                className="font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.terms}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-blue-600 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {processing
                                            ? 'Creating Account...'
                                            : 'Create Account'}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 -z-0 bg-blue-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Sign in →
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

export default Register;
