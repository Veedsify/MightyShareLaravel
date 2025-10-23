import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ForgotPasswordProps {
    status?: string;
}

const ForgotPassword = ({ status }: ForgotPasswordProps) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Forgot Password" />
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
                            {/* Success Message */}
                            {status && (
                                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <h4 className="font-semibold text-green-900">
                                                Email Sent!
                                            </h4>
                                            <p className="mt-1 text-sm text-green-700">
                                                {status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Header */}
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    Forgot Password? 🔒
                                </h2>
                                <p className="text-gray-600">
                                    No worries! Enter your email and we'll send
                                    you reset instructions.
                                </p>
                            </div>

                            {/* Form */}
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
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {processing
                                            ? 'Sending Reset Link...'
                                            : 'Send Reset Link'}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    Sign up for free →
                                </Link>
                            </p>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 rounded-xl bg-blue-50 p-4">
                            <p className="text-center text-xs text-blue-800">
                                <span className="font-semibold">
                                    🔐 Security Notice:
                                </span>{' '}
                                For your protection, we'll only send reset
                                instructions if the email exists in our system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
