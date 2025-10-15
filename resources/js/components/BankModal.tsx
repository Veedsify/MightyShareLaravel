import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Check, Copy, CreditCard, Loader, X } from 'lucide-react';
import React, { useState } from 'react';

interface BankModalProps {
    isOpen: boolean;
    onClose: (showMessage?: boolean) => void;
    bankName: string;
    transactionId: string;
    orderId: string;
    accountNumber: string;
    amount?: number;
    accountName?: string;
    isTopUp?: boolean; // Flag to indicate if this is a topup transaction
    onSuccess?: () => void; // Callback for successful topup
}

const BankModal: React.FC<BankModalProps> = ({
    isOpen,
    onClose,
    bankName,
    accountNumber,
    transactionId,
    orderId,
    amount,
    accountName = 'Mightyshare Charity Foundation',
    isTopUp = false,
    onSuccess,
}) => {
    const [hasTransferred, setHasTransferred] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const props = usePage().props;
    const [transactionData, setTransactionData] = useState<{
        amount: number;
        reference: string;
        date: string;
        creditedAmount?: number;
        registrationFeeDeducted?: number;
    } | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const validateTransaction = async () => {
        setIsLoading(true);

        try {
            // Use different endpoint based on transaction type
            const verifyEndpoint = isTopUp
                ? '/alatpay/topup-verify'
                : '/alatpay/verify';

            const response = await axios.post(
                verifyEndpoint,
                {
                    transactionId,
                    orderId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': props.csrf_token as string,
                    },
                },
            );

            const result = response.data;
            if (result.success) {
                setHasTransferred(true);
                setTransactionData({
                    amount: result.amount,
                    reference: result.reference,
                    date: new Date(result.updatedAt).toLocaleTimeString(
                        'en-US',
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        },
                    ),
                    creditedAmount: result.creditedAmount,
                    registrationFeeDeducted: result.registrationFeeDeducted,
                });

                // Call onSuccess callback if provided (for topup)
                if (isTopUp && onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                }
                return;
            }
            setError(true);
            console.error('Transaction not found or not completed');
            return false;
        } catch (error) {
            setHasTransferred(false);
            setIsLoading(false);
            setError(true);
            console.error('Transaction validation error:', error);
            return false;
        }
    };

    const handleContinueToDashboard = () => {
        router.visit('/dashboard');
        onClose(false);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 animate-in fade-in"
            onClick={() => onClose(true)}
        >
            <div
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <button
                        onClick={() => onClose(true)}
                        className="absolute top-4 right-4 rounded-lg p-1 text-blue-100 transition-colors hover:text-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Bank Transfer
                            </h2>
                            <p className="text-sm text-blue-100">
                                Complete your payment securely
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-2 md:p-6">
                    {!hasTransferred && !error && (
                        <div className="opacity-100 transition-opacity duration-300">
                            {/* Premium Bank Details Card */}
                            <div className="mb-6 rounded-xl bg-gray-50 p-3 md:p-5">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                    <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                        Transfer to
                                    </span>
                                </div>

                                {/* Bank Logo and Name */}
                                <div className="mb-5 flex items-center gap-4">
                                    {/* Logo Placeholder */}
                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
                                        <img
                                            src="/wemabank.svg"
                                            alt={`${bankName} Logo`}
                                            className="h-12 w-12 rounded-md object-contain"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {bankName}
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Account Name: <br />
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {accountName}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                                            Account Number
                                        </label>
                                        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                                            <span className="text-lg font-bold text-gray-900">
                                                {accountNumber}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleCopy(
                                                        accountNumber,
                                                        'account',
                                                    )
                                                }
                                                className="text-blue-500 transition-colors hover:text-blue-700"
                                            >
                                                {copiedField === 'account' ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Copy className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {amount && (
                                        <div>
                                            <label className="mb-1 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                                                Amount
                                            </label>
                                            <div className="rounded-lg bg-white p-4 shadow-sm">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₦{amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                                <div className="flex gap-3">
                                    <svg
                                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-sm leading-relaxed text-gray-700">
                                        Transfer the required amount to the
                                        account above using your bank app or
                                        USSD, then click the button below to
                                        confirm.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={validateTransaction}
                                disabled={isLoading}
                                className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:transform-none disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader className="mr-2 inline-block animate-spin" />
                                        Validating...
                                    </span>
                                ) : (
                                    <span>I've completed the transfer</span>
                                )}
                            </button>
                        </div>
                    )}

                    {hasTransferred && !error && (
                        <div className="opacity-100 transition-opacity duration-300">
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    Payment Confirmed
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your transfer has been verified successfully
                                </p>
                            </div>

                            <div className="space-y-4">
                                {transactionData?.registrationFeeDeducted &&
                                    transactionData.registrationFeeDeducted >
                                        0 && (
                                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                            <p className="text-sm text-yellow-800">
                                                <strong>
                                                    Registration Fee:
                                                </strong>{' '}
                                                ₦
                                                {transactionData.registrationFeeDeducted.toLocaleString()}{' '}
                                                deducted from your payment
                                            </p>
                                        </div>
                                    )}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Amount Transferred
                                    </label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-gray-500">
                                            ₦
                                        </span>
                                        <div className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-9">
                                            <span className="font-medium text-gray-900">
                                                {transactionData?.amount.toLocaleString() ||
                                                    '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {transactionData?.creditedAmount !==
                                    undefined &&
                                    transactionData.creditedAmount !==
                                        transactionData.amount && (
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Amount Credited to Wallet
                                            </label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-green-600">
                                                    ₦
                                                </span>
                                                <div className="w-full rounded-xl border-2 border-green-200 bg-green-50 py-3 pr-4 pl-9">
                                                    <span className="font-medium text-green-900">
                                                        {transactionData.creditedAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Transaction Reference
                                    </label>
                                    <div className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3">
                                        <span className="font-medium text-gray-900">
                                            {transactionData?.reference ||
                                                'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Transaction Date
                                    </label>
                                    <div className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3">
                                        <span className="font-medium text-gray-900">
                                            {transactionData?.date
                                                ? transactionData.date
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleContinueToDashboard}
                                className="mt-6 w-full transform rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-500/20 focus:outline-none"
                            >
                                Continue to Dashboard
                            </button>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="text-center opacity-100 transition-opacity duration-300">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-8 w-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">
                                Validation Failed
                            </h3>
                            <p className="mb-4 text-sm text-gray-600">
                                We couldn't verify your transaction. Please
                                ensure you have completed the transfer and try
                                again.
                            </p>
                            <button
                                onClick={() => {
                                    setError(false);
                                    setIsLoading(false);
                                    setHasTransferred(false);
                                }}
                                className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-4 focus:ring-red-500/20 focus:outline-none"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Secured by AlatPay • SSL Encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankModal;
