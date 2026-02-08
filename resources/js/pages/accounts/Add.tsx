'use client';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, LucideStar, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    createdAt: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    accounts: Account[];
}

interface ActiveSubscription {
    id: number;
    package: {
        name: string;
        minAccountLimit: number;
        maxAccountLimit: number;
    };
}

interface AddAccountProps {
    user: User;
    limits: {
        minAccountLimit: number;
        maxAccountLimit: number;
    };
    currentCount: number;
    remaining: number;
    needsMore: number;
    meetsMinimum: boolean;
    activeSubscription: ActiveSubscription | null;
}

const AddAccount = ({
    user,
    limits,
    currentCount,
    remaining,
    needsMore,
    meetsMinimum,
    activeSubscription,
}: AddAccountProps) => {
    const [qty, setQty] = useState<number>(1);
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [localAccounts, setLocalAccounts] = useState<Account[]>(
        user.accounts || [],
    );

    // Create new sub-accounts
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setBusy(true);
        setError('');
        setSuccessMsg('');

        try {
            const q = Number(qty);

            if (!(q >= 1)) {
                throw new Error('Please enter a valid quantity.');
            }

            if (currentCount >= limits.maxAccountLimit) {
                setShowLimitModal(true);
                setBusy(false);
                return;
            }

            if (currentCount + q > limits.maxAccountLimit) {
                setShowLimitModal(true);
                setBusy(false);
                return;
            }

            // Create accounts via Laravel API
            const response = await axios.post(
                '/dashboard/accounts/store',
                { quantity: q },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                },
            );

            if (response.data.success && response.data.accounts) {
                setSuccessMsg(`Successfully created ${q} account(s)!`);

                // Update local accounts list
                setLocalAccounts([...localAccounts, ...response.data.accounts]);
                setQty(1);

                // Reload page after 2 seconds to refresh all data
                setTimeout(() => {
                    router.reload();
                }, 2000);
            }
        } catch (err: unknown) {
            const error = err as {
                response?: { data?: { error?: string }; status?: number };
                message?: string;
            };
            if (error.response?.data?.error) {
                setError(error.response.data.error);
                // Show modal if it's a limit error
                if (
                    error.response.status === 400 &&
                    (error.response.data.error.includes('limit') ||
                        error.response.data.error.includes('exceed'))
                ) {
                    setShowLimitModal(true);
                }
            } else {
                setError(error.message || 'Failed to create accounts.');
            }
        } finally {
            setBusy(false);
        }
    };

    if (!user) return null;

    const packageName = activeSubscription?.package?.name || 'Default';

    return (
        <>
            <Head title="Add Account" />
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 lg:p-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg">
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                                <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                                <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
                            </div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="bg-white/20 p-3 backdrop-blur-sm">
                                            <UserPlus className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold">
                                                Add Account
                                            </h1>
                                            <p className="mt-1 text-blue-100">
                                                Create additional sub-accounts
                                                for your operations
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Package Info Cards */}
                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="bg-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-blue-100">
                                        Package
                                    </p>
                                    <p className="mt-1 text-xl font-bold">
                                        {packageName}
                                    </p>
                                </div>
                                <div className="bg-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-blue-100">
                                        Current
                                    </p>
                                    <p className="mt-1 text-xl font-bold">
                                        {currentCount}
                                    </p>
                                </div>
                                <div className="bg-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-blue-100">
                                        Min Required
                                    </p>
                                    <p className="mt-1 text-xl font-bold">
                                        {limits.minAccountLimit}
                                    </p>
                                </div>
                                <div className="bg-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-blue-100">
                                        Max Allowed
                                    </p>
                                    <p className="mt-1 text-xl font-bold">
                                        {limits.maxAccountLimit}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-4">
                                {meetsMinimum ? (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold">
                                        ✓ Minimum requirement met • {remaining}{' '}
                                        slots remaining
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold">
                                        ⚠️ Need {needsMore} more account(s) to
                                        meet minimum
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="relative mb-16 overflow-hidden bg-white shadow-lg">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-blue-50 p-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Create New Accounts
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Specify how many sub-accounts you'd like to
                                    create
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Number of Accounts
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={Math.max(1, remaining)}
                                            value={qty
                                                <= 0 ? '' : qty
                                            }
                                            onChange={(e) =>
                                                setQty(Number(e.target.value))
                                            }
                                            className="w-full border-2 border-gray-300 px-4 py-3 text-lg font-medium transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 text-black"
                                            required
                                            disabled={remaining <= 0}
                                            placeholder="Enter quantity"
                                        />
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center justify-between bg-blue-50 p-3 text-sm">
                                                <span className="text-gray-600">
                                                    Available slots
                                                </span>
                                                <span className="font-bold text-blue-600">
                                                    {remaining} remaining
                                                </span>
                                            </div>
                                            {needsMore > 0 && (
                                                <div className="flex items-start gap-2 bg-orange-50 p-3 text-sm">
                                                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                                                        !
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-orange-900">
                                                            Minimum requirement
                                                            not met
                                                        </p>
                                                        <p className="mt-1 text-orange-700">
                                                            Your package
                                                            requires at least{' '}
                                                            <b>
                                                                {
                                                                    limits.minAccountLimit
                                                                }
                                                            </b>{' '}
                                                            accounts. Create{' '}
                                                            <b>{needsMore}</b>{' '}
                                                            more to meet this
                                                            requirement.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {meetsMinimum &&
                                                currentCount <
                                                limits.maxAccountLimit && (
                                                    <div className="flex items-start gap-2 bg-green-50 p-3 text-sm">
                                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                                                            ✓
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-green-900">
                                                                Ready to expand
                                                            </p>
                                                            <p className="mt-1 text-green-700">
                                                                You've met the
                                                                minimum
                                                                requirement and
                                                                can create up to{' '}
                                                                <b>
                                                                    {remaining}
                                                                </b>{' '}
                                                                more account(s).
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 p-4">
                                            <p className="text-sm font-medium text-red-800">
                                                {error}
                                            </p>
                                        </div>
                                    )}
                                    {successMsg && (
                                        <div className="bg-green-50 p-4">
                                            <p className="text-sm font-medium text-green-800">
                                                {successMsg}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="submit"
                                            disabled={busy || remaining <= 0}
                                            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                                        >
                                            {busy
                                                ? 'Creating Accounts...'
                                                : remaining <= 0
                                                    ? 'Maximum Limit Reached'
                                                    : `Create ${qty} Account${qty > 1 ? 's' : ''}`}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.visit('/dashboard')
                                            }
                                            className="border-2 border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Account List Section */}
                    <div className="relative overflow-hidden bg-white shadow-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-pink-50 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Your Accounts
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {localAccounts.length}{' '}
                                    {localAccounts.length === 1
                                        ? 'account'
                                        : 'accounts'}{' '}
                                    created
                                </p>
                            </div>
                            <div>
                                {meetsMinimum ? (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30">
                                            ✓
                                        </div>
                                        <span>
                                            Min Met ({currentCount}/
                                            {limits.minAccountLimit})
                                        </span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30">
                                            !
                                        </div>
                                        <span>
                                            Need {needsMore} More (
                                            {currentCount}/
                                            {limits.minAccountLimit})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {localAccounts.length ? (
                                <>
                                    <div className="space-y-3">
                                        {localAccounts.map(
                                            (a: Account, idx: number) => (
                                                <div
                                                    key={`${a.accountNumber || a.id}-${idx}`}
                                                    className="group flex items-center justify-between border-2 border-gray-200 p-4 transition-all hover:border-blue-500 hover:shadow-md"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-lg font-bold text-white shadow-md">
                                                            {idx === 0 ? (
                                                                <LucideStar />
                                                            ) : (
                                                                idx + 1
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {idx === 0
                                                                    ? 'Primary Account'
                                                                    : `Sub Account ${idx}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    a.accountNumber
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">
                                                            Balance
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900">
                                                            ₦
                                                            {Number(
                                                                a.balance /
                                                                100 || 0,
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Package Limits Info */}
                                    <div className="mt-6 border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                <p className="font-semibold text-gray-700">
                                                    Package Limits
                                                </p>
                                                <p className="mt-1 text-gray-600">
                                                    {packageName}
                                                </p>
                                            </div>
                                            <div className="flex gap-6 text-right">
                                                <div>
                                                    <p className="text-gray-600">
                                                        Minimum
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {limits.minAccountLimit}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">
                                                        Maximum
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {limits.maxAccountLimit}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                        <UserPlus className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        No accounts yet
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Create your first account to get started
                                    </p>
                                    {needsMore > 0 && (
                                        <div className="mx-auto mt-4 max-w-md bg-orange-50 p-4">
                                            <p className="text-sm font-medium text-orange-900">
                                                ⚠️ Create at least{' '}
                                                <b>{needsMore}</b> account(s) to
                                                meet the minimum requirement
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Limit Reached Modal */}
                <AnimatePresence>
                    {showLimitModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLimitModal(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-full max-w-md overflow-hidden rounded-2xl bg-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="relative bg-red-600 p-6">
                                    <button
                                        onClick={() => setShowLimitModal(false)}
                                        className="absolute top-4 right-4 text-white transition-colors hover:text-gray-200"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700">
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                Account Limit Reached
                                            </h2>
                                            <p className="text-sm text-white">
                                                Unable to create more accounts
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="mb-6 text-center">
                                            <p className="mb-4 text-gray-700">
                                                You have reached the maximum
                                                number of accounts allowed for
                                                your package.
                                            </p>

                                            <div className="mb-4 bg-gray-50 p-4">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Your Package:
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {packageName}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Current Accounts:
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {currentCount}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Minimum Required:
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {
                                                                limits.minAccountLimit
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Maximum Allowed:
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {
                                                                limits.maxAccountLimit
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                To create more accounts, please
                                                upgrade your package or contact
                                                support.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setShowLimitModal(false)
                                            }
                                            className="relative w-full transform bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                        <span>
                                            Need help? Contact
                                            support@mightyshare.com
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DashboardLayout>
        </>
    );
};

export default AddAccount;
