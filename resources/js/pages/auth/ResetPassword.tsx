import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ResetPasswordProps {
    email: string;
    token: string;
}

const ResetPassword = ({ email, token }: ResetPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        const strengthMap = {
            1: { label: 'Weak', color: 'bg-red-500' },
            2: { label: 'Fair', color: 'bg-orange-500' },
            3: { label: 'Good', color: 'bg-yellow-500' },
            4: { label: 'Strong', color: 'bg-green-500' },
        };

        return {
            strength,
            ...(strengthMap[strength as keyof typeof strengthMap] || {
                label: '',
                color: '',
            }),
        };
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <>
            <Head title="Reset Password" />
            <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-pink-50">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 -left-4 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute top-40 right-20 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl" />
                    <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl" />
                </div>

                {/* Main Content */}
                <div className="relative flex w-full items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        {/* Logo */}
                        <div className="mb-10 text-center">
                            <Link href="/" className="inline-block">
                                <img
                                    src="/images/logo.jpg"
                                    alt="MightyShare Logo"
                                    className="h-12 w-12 rounded-full"
                                />
                            </Link>
                            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                                MightyShare
                            </h1>
                            <p className="text-gray-600">
                                Your Trusted Thrift Partner
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
                            {/* Form Header */}
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    Set New Password 🔑
                                </h2>
                                <p className="text-gray-600">
                                    Choose a strong password to secure your
                                    account
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field (Read-only) */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            readOnly
                                            className="w-full cursor-not-allowed rounded-xl border-2 border-gray-200 bg-gray-100 py-3.5 pr-4 pl-12 text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        New Password
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

                                    {/* Password Strength Indicator */}
                                    {data.password && (
                                        <div className="mt-3">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs font-medium text-gray-600">
                                                    Password strength:
                                                </span>
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        passwordStrength.strength ===
                                                        4
                                                            ? 'text-green-600'
                                                            : passwordStrength.strength ===
                                                                3
                                                              ? 'text-yellow-600'
                                                              : passwordStrength.strength ===
                                                                  2
                                                                ? 'text-orange-600'
                                                                : 'text-red-600'
                                                    }`}
                                                >
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1.5 flex-1 rounded-full transition-all ${
                                                            level <=
                                                            passwordStrength.strength
                                                                ? passwordStrength.color
                                                                : 'bg-gray-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
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
                                    {data.password &&
                                        data.password_confirmation &&
                                        data.password ===
                                            data.password_confirmation && (
                                            <p className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Passwords match
                                            </p>
                                        )}
                                </div>

                                {/* Password Requirements */}
                                <div className="rounded-xl bg-blue-50 p-4">
                                    <h4 className="mb-2 text-sm font-semibold text-blue-900">
                                        Password Requirements:
                                    </h4>
                                    <ul className="space-y-1 text-xs text-blue-800">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2
                                                className={`h-3.5 w-3.5 ${
                                                    data.password.length >= 8
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            At least 8 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2
                                                className={`h-3.5 w-3.5 ${
                                                    data.password.match(
                                                        /[a-z]/,
                                                    ) &&
                                                    data.password.match(/[A-Z]/)
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            Mix of uppercase and lowercase
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2
                                                className={`h-3.5 w-3.5 ${
                                                    data.password.match(/[0-9]/)
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            At least one number
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2
                                                className={`h-3.5 w-3.5 ${
                                                    data.password.match(
                                                        /[^a-zA-Z0-9]/,
                                                    )
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            At least one special character
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {processing
                                            ? 'Resetting Password...'
                                            : 'Reset Password'}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </form>
                        </div>

                        {/* Back to Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    Back to Login →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
