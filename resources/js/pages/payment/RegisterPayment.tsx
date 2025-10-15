import { Head, router, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { CreditCard, Loader, Package, Sparkles } from 'lucide-react';
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
            <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-pink-50">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 -left-4 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute top-40 right-20 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl" />
                    <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl" />
                </div>

                <div className="relative z-10 flex w-full items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-lg">
                        <Card className="border-2 border-gray-200 shadow-xl">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600">
                                    <Package className="h-10 w-10 text-white" />
                                </div>
                                <CardTitle className="mb-3 text-3xl font-bold text-gray-900">
                                    Complete Registration
                                </CardTitle>
                                <div className="space-y-2">
                                    <p className="text-base leading-relaxed text-gray-600">
                                        A one-time registration fee of{' '}
                                        <span className="font-bold text-blue-900">
                                            ₦{Number(fee).toLocaleString()}
                                        </span>{' '}
                                        is required to activate your MightyShare
                                        account.
                                    </p>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                                        <Sparkles className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">
                                            Secure Payment Processing
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {/* Verification State */}
                                {isVerifying ? (
                                    <div className="py-10 text-center">
                                        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-900"></div>
                                        <p className="text-lg font-medium text-gray-700">
                                            {message.text}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Payment Buttons */}
                                        <div className="mb-6 space-y-4">
                                            <Button
                                                onClick={() =>
                                                    initializePayment('alatpay')
                                                }
                                                disabled={isAnyActionInProgress}
                                                variant="default"
                                                size="lg"
                                                className="h-14 w-full text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100"
                                            >
                                                {loadingProvider ===
                                                'alatpay' ? (
                                                    <>
                                                        <Loader
                                                            className="animate-spin"
                                                            size={20}
                                                        />
                                                        <span>
                                                            Processing...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard size={20} />
                                                        <span>
                                                            Pay with ALATPay
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Message Display */}
                                        {message.text && (
                                            <div
                                                className={getMessageClassName()}
                                            >
                                                {message.text}
                                            </div>
                                        )}

                                        {/* Skip Option */}
                                        <div className="mt-8 border-t border-gray-200 pt-6">
                                            <Button
                                                onClick={() =>
                                                    router.visit('/dashboard')
                                                }
                                                disabled={isAnyActionInProgress}
                                                variant="ghost"
                                                className="w-full text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                                            >
                                                Skip payment and continue to
                                                Dashboard →
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
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
