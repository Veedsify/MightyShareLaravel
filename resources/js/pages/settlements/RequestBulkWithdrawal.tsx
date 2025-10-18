import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Account = {
    id: number | string;
    accountNumber: string;
    balance: number;
    accountName?: string | null;
    bankName?: string | null;
};

const ACCOUNT_ENDPOINTS = [
    '/api/accounts',
    '/api/settlements/accounts',
    '/api/settlement-accounts',
];

const normalizeAccounts = (accounts: unknown): Account[] => {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map((account, index) => {
        if (typeof account !== 'object' || account === null) {
            return {
                id: `account-${index}`,
                accountNumber: 'N/A',
                balance: 0,
                accountName: null,
                bankName: null,
            };
        }

        const record = account as Record<string, unknown>;
        const rawBalance = record.balance ?? record.amount;
        let balanceValue = 0;

        if (typeof rawBalance === 'number') {
            balanceValue = rawBalance;
        } else if (typeof rawBalance === 'string') {
            const cleaned = rawBalance.replace(/[^\d.-]/g, '');
            const parsed = Number(cleaned);
            balanceValue = Number.isFinite(parsed) ? parsed : 0;
        }

        return {
            id:
                (record.id as number | string | undefined) ?? `account-${index}`,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                'N/A',
            balance: balanceValue,
            accountName:
                (record.accountName as string | undefined) ??
                (record.account_name as string | undefined) ??
                null,
            bankName:
                (record.bankName as string | undefined) ??
                (record.bank_name as string | undefined) ??
                null,
        };
    });
};

const RequestBulkWithdrawal = () => {
    const [availableAccounts, setAvailableAccounts] = useState<Account[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of ACCOUNT_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        withCredentials: true,
                    });

                    const payload =
                        (data?.accounts as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const normalised = normalizeAccounts(payload);

                    if (isMounted && (normalised.length > 0 || Array.isArray(payload))) {
                        setAvailableAccounts(normalised);
                        setLoading(false);
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint === ACCOUNT_ENDPOINTS[ACCOUNT_ENDPOINTS.length - 1]
                    ) {
                        if (isMounted) {
                            setError(
                                'Unable to load available settlement accounts. Refresh or try again later.',
                            );
                        }
                    }
                }
            }

            if (isMounted) {
                setLoading(false);
            }
        };

        fetchAccounts();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredAvailableAccounts = useMemo(() => {
        if (!searchQuery) {
            return availableAccounts.filter(
                (account) =>
                    !selectedAccounts.some(
                        (selected) => selected.id === account.id,
                    ),
            );
        }

        const lowerQuery = searchQuery.toLowerCase();

        return availableAccounts.filter((account) => {
            if (selectedAccounts.some((selected) => selected.id === account.id)) {
                return false;
            }

            return (
                account.accountNumber.toLowerCase().includes(lowerQuery) ||
                (account.accountName ?? '').toLowerCase().includes(lowerQuery)
            );
        });
    }, [availableAccounts, selectedAccounts, searchQuery]);

    const totalSelectedAmount = useMemo(
        () =>
            selectedAccounts.reduce(
                (sum, account) => sum + account.balance,
                0,
            ),
        [selectedAccounts],
    );

    const handleAddAccount = (account: Account) => {
        setSelectedAccounts((prev) => [...prev, account]);
        setSearchQuery('');
    };

    const handleRemoveAccount = (id: Account['id']) => {
        setSelectedAccounts((prev) =>
            prev.filter((account) => account.id !== id),
        );
    };

    const handleClearAll = () => {
        setSelectedAccounts([]);
        setNotes('');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedAccounts.length === 0) {
            window.alert(
                'Please add at least one account to your bulk withdrawal request.',
            );
            return;
        }

        setIsSubmitting(true);

        // Placeholder for API submission. Replace with actual implementation when endpoint is ready.
        setTimeout(() => {
            window.alert(
                `Bulk withdrawal request for ₦${totalSelectedAmount.toLocaleString()} submitted successfully!`,
            );
            handleClearAll();
            setIsSubmitting(false);
        }, 1200);
    };

    return (
        <>
            <Head title="Request Bulk Withdrawal - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Request Bulk Account Withdrawal
                        </h1>
                        <p className="text-sm text-gray-600">
                            Combine multiple settlement accounts into a single withdrawal request.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Add Accounts to Request
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Search by account number or name to add eligible settlement accounts.
                                </p>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Search account number or name..."
                                    className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                {loading ? (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        Loading accounts...
                                    </div>
                                ) : filteredAvailableAccounts.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        {searchQuery
                                            ? 'No accounts match your search.'
                                            : 'No additional accounts available.'}
                                    </div>
                                ) : (
                                    filteredAvailableAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {account.accountNumber}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {account.accountName ?? 'Settlement Account'}
                                                </p>
                                                <p className="text-sm font-medium text-blue-600">
                                                    Balance: ₦{account.balance.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddAccount(account)}
                                                className="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Selected Accounts ({selectedAccounts.length})
                                </h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-xl font-bold text-blue-700">
                                        ₦{totalSelectedAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                {selectedAccounts.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-gray-500">
                                        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                                        <p>No accounts selected yet.</p>
                                        <p className="text-sm text-gray-400">
                                            Use the search to add settlement accounts.
                                        </p>
                                    </div>
                                ) : (
                                    selectedAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {account.accountNumber}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {account.accountName ?? 'Settlement Account'}
                                                </p>
                                                <p className="text-sm font-medium text-blue-600">
                                                    Balance: ₦{account.balance.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAccount(account.id)}
                                                className="rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div>
                            <label
                                htmlFor="bulk-notes"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Additional Notes (optional)
                            </label>
                            <textarea
                                id="bulk-notes"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Include any context or instructions that will help us process this bulk withdrawal."
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                disabled={selectedAccounts.length === 0 && !notes}
                            >
                                Clear All
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedAccounts.length === 0}
                                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
};

export default RequestBulkWithdrawal;
