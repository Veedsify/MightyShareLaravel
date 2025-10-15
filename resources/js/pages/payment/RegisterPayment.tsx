import { Head, router, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import {
    CreditCard,
    Loader,
    Package,
    Sparkles,
    Check,
    Shield,
    ArrowRight,
    Lock,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BankModal from '../../components/BankModal';
import { Button } from '../../components/ui/Button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/Card';

// Types
type PaymentProvider = 'alatpay';
type MessageType = 'idle' | 'success' | 'error' | 'info';

interface MessageState {
    text: string;
    type: MessageType;
}

interface PaymentData {
    status: boolean;
    virtualBankAccountNumber: string;
    bankName: string;
    orderId: string;
    transactionId: string;
    amount: number;
}

interface PaymentResponse {
    data?: PaymentData;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    registration_paid: boolean;
    thrift_subscriptions?: Array<{
        status: string;
        package: {
            name: string;
            price: number;
        };
    }>;
}

interface RegisterPaymentProps {
    user: User;
}

const REDIRECT_DELAY = 2000;

export default function RegisterPayment({ user }: RegisterPaymentProps) {
    const props = usePage().props;

    // State management
    const [loadingProvider, setLoadingProvider] =
        useState<PaymentProvider | null>(null);
    const [bankdata, setBankdata] = useState<PaymentData | null>(null);
    const [bankAccountModalOpen, setBankAccountModalOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [message, setMessage] = useState<MessageState>({
        text: '',
        type: 'idle',
    });

    // Calculate registration fee from user's thrift package (default ₦2,500)
    const fee = useMemo(() => {
        // Get the active thrift subscription's package price
        const activeSubscription = user?.thrift_subscriptions?.find(
            (sub) => sub.status === 'active',
        );
        return activeSubscription?.package?.price || 2500;
    }, [user]);

    // Helper to update message
    const updateMessage = useCallback((text: string, type: MessageType) => {
        setMessage({ text, type });
    }, []);

    // Helper to clear message
    const clearMessage = useCallback(() => {
        setMessage({ text: '', type: 'idle' });
    }, []);

    // Complete user registration after successful payment
    const completeRegistration = useCallback(
        async (userId: string) => {
            try {
                // Make request to mark registration as paid
                await axios.post(
                    '/payment/registration/complete',
                    { userId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': props.csrf_token as string,
                        },
                    },
                );

                updateMessage(
                    '✅ Payment verified successfully! Redirecting...',
                    'success',
                );

                setTimeout(() => router.visit('/dashboard'), REDIRECT_DELAY);
            } catch (error) {
                console.error('Registration completion error:', error);
                updateMessage(
                    '⚠️ Payment verified but registration update failed. Please contact support.',
                    'error',
                );
            }
        },
        [updateMessage, props.csrf_token],
    );

    // Verify payment after callback redirect
    const verifyPayment = useCallback(
        async (reference: string) => {
            setIsVerifying(true);
            updateMessage('🔄 Verifying your payment...', 'info');

            try {
                const response = await axios.post(
                    '/alatpay/verify',
                    { reference, orderId: reference },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': props.csrf_token as string,
                        },
                    },
                );

                const data = response.data;
                if (data.success && data.userId) {
                    await completeRegistration(data.userId);
                } else {
                    updateMessage(
                        '❌ Payment verification failed. Please contact support.',
                        'error',
                    );
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                const axiosError = error as AxiosError<{ error?: string }>;
                updateMessage(
                    axiosError.response?.data?.error ||
                        '❌ Payment verification failed. Please try again.',
                    'error',
                );
            } finally {
                setIsVerifying(false);
            }
        },
        [updateMessage, completeRegistration, props.csrf_token],
    );

    // Initialize payment with AlatPay
    const initializePayment = useCallback(
        async (provider: PaymentProvider) => {
            setLoadingProvider(provider);
            clearMessage();

            try {
                const response = await axios.post<PaymentResponse>(
                    '/alatpay/initialize',
                    {
                        amount: fee,
                        currency: 'NGN',
                        description: 'MightyShare Registration Fee',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': props.csrf_token as string,
                        },
                    },
                );

                const data = response.data.data;
                console.log(data);

                if (data?.status && data.transactionId) {
                    setBankdata(data);
                    setBankAccountModalOpen(true);
                    return;
                }

                updateMessage(
                    '❌ Payment initialization failed. Please try again.',
                    'error',
                );
            } catch (error) {
                console.error('Payment initialization error:', error);
                const axiosError = error as AxiosError<{ error?: string }>;
                updateMessage(
                    axiosError.response?.data?.error ||
                        '❌ ALATPay payment failed. Please try again.',
                    'error',
                );
            } finally {
                setLoadingProvider(null);
            }
        },
        [clearMessage, updateMessage, fee, props],
    );

    // Handle payment callback on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const provider = urlParams.get('provider') as PaymentProvider | null;
        const status = urlParams.get('status');

        if (reference && provider === 'alatpay') {
            verifyPayment(reference);
        } else if (status === 'failed') {
            updateMessage('❌ Payment failed. Please try again.', 'error');
        }
    }, [verifyPayment, updateMessage]);

    // Compute loading states
    const isProcessing = loadingProvider !== null;
    const isAnyActionInProgress = isProcessing || isVerifying;

    // Get message styling based on type
    const getMessageClassName = () => {
        const baseClasses =
            'mt-4 p-4 rounded-xl text-center text-sm font-medium transition-all duration-300';
        switch (message.type) {
            case 'success':
                return `${baseClasses} bg-green-50 text-green-800 border-2 border-green-200`;
            case 'error':
                return `${baseClasses} bg-red-50 text-red-800 border-2 border-red-200`;
            case 'info':
                return `${baseClasses} bg-blue-50 text-blue-800 border-2 border-blue-200`;
            default:
                return baseClasses;
        }
    };

    const handleOnClose = (showMessage?: boolean) => {
        if (!showMessage) {
            return setBankAccountModalOpen(false);
        }

        if (
            confirm(
                'Closing this window will cancel the payment process. Do you want to proceed?',
            )
        ) {
            setBankAccountModalOpen(false);
        }
    };

    // Redirect if user is already paid
    if (user?.registration_paid) {
        router.visit('/dashboard');
        return null;
    }

    return (
        <>
            <Head title="Complete Registration Payment" />
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
                                Welcome to MightyShare
                            </span>
                        </div>
                        <h1 className="mb-3 text-5xl font-bold text-white">
                            Almost There!
                        </h1>
                        <p className="text-xl text-blue-100">
                            Complete your registration to unlock all features
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Benefits List */}
                        <div className="rounded-2xl border border-blue-400/30 bg-white/10 p-6 backdrop-blur-md">
                            <h3 className="mb-4 text-xl font-bold text-white">
                                What You'll Get
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Access to your savings dashboard',
                                    'Flexible withdrawal options',
                                    'Real-time transaction tracking',
                                    'Secure payment processing',
                                    'Dedicated customer support',
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

                        {/* Security Badge */}
                        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                                    <Shield className="h-7 w-7 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">
                                        Secure Payment
                                    </p>
                                    <p className="text-sm text-blue-200">
                                        256-bit SSL encrypted
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200">
                        © 2025 MightyShare. All rights reserved.
                    </p>
                </div>

                {/* Right Side - Enhanced Payment Form */}
                <div className="relative flex w-full items-center justify-center overflow-y-auto p-4 md:p-8 lg:w-1/2">
                    <div className="w-full max-w-lg">
                        {/* Mobile Logo */}
                        <div className="mb-10 text-center lg:hidden">
                            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                                MightyShare
                            </h1>
                            <p className="text-gray-600">
                                Complete Your Registration
                            </p>
                        </div>

                        {/* Payment Card */}
                        <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
                            {/* Form Header */}
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                    <Package className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    Complete Registration 🎉
                                </h2>
                                <p className="text-gray-600">
                                    Just one step away from your savings journey
                                </p>
                            </div>

                            {/* Verification State */}
                            {isVerifying ? (
                                <div className="py-10 text-center">
                                    <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {message.text}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Fee Display */}
                                    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px]">
                                        <div className="rounded-[14px] bg-white p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">
                                                        Registration Fee
                                                    </p>
                                                    <p className="mt-1 text-3xl font-bold text-gray-900">
                                                        ₦
                                                        {Number(
                                                            fee,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
                                                    <Lock className="h-7 w-7 text-white" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <p className="text-sm font-medium text-green-800">
                                                    One-time payment only
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <div className="mb-6">
                                        <button
                                            onClick={() =>
                                                initializePayment('alatpay')
                                            }
                                            disabled={isAnyActionInProgress}
                                            className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-blue-600 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loadingProvider ===
                                                'alatpay' ? (
                                                    <>
                                                        <Loader className="h-5 w-5 animate-spin" />
                                                        <span>
                                                            Processing
                                                            Payment...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="h-5 w-5" />
                                                        <span>
                                                            Pay with ALATPay
                                                        </span>
                                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                            <div className="absolute inset-0 -z-0 bg-blue-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </button>
                                    </div>

                                    {/* Message Display */}
                                    {message.text && (
                                        <div className={getMessageClassName()}>
                                            {message.text}
                                        </div>
                                    )}

                                    {/* Security Note */}
                                    <div className="mt-6 rounded-xl bg-gray-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Secure Payment
                                                </p>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    Your payment information is
                                                    encrypted and secure. We
                                                    never store your card
                                                    details.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skip Option */}
                                    <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                                        <button
                                            onClick={() =>
                                                router.visit('/dashboard')
                                            }
                                            disabled={isAnyActionInProgress}
                                            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:text-gray-300"
                                        >
                                            Skip payment and continue to
                                            Dashboard →
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bank Modal */}
                {bankAccountModalOpen && bankdata && (
                    <BankModal
                        accountNumber={bankdata.virtualBankAccountNumber}
                        bankName={bankdata.bankName || 'Wema Bank PLC'}
                        orderId={bankdata.orderId}
                        transactionId={bankdata.transactionId}
                        amount={bankdata.amount}
                        isOpen={bankAccountModalOpen}
                        onClose={handleOnClose}
                    />
                )}
            </div>
        </>
    );
}
