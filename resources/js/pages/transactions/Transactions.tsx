import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Filter,
    Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type TransactionStatus = 'successful' | 'pending' | 'failed' | string;
type TransactionType = 'credit' | 'debit' | string;

type Transaction = {
    id: number | string;
    reference: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    paymentMethod?: string | null;
    description?: string | null;
    createdAt: string | null;
    accountNumber?: string | null;
};

type AccountOption = {
    id: number | string;
    accountNumber: string;
    label: string;
};

const TRANSACTION_ENDPOINTS = [
    '/api/transactions',
    '/api/transactions/index',
    '/api/transactions/list',
];

const normalizeTransactions = (transactions: unknown): Transaction[] => {
    if (!Array.isArray(transactions)) {
        return [];
    }

    return transactions.map((transaction, index) => {
        if (typeof transaction !== 'object' || transaction === null) {
            return {
                id: `transaction-${index}`,
                reference: `TRX-${index}`,
                amount: 0,
                type: 'credit',
                status: 'pending',
                paymentMethod: null,
                description: null,
                createdAt: null,
                accountNumber: null,
            };
        }

        const record = transaction as Record<string, unknown>;
        const rawAmount = record.amount;
        let amountValue = 0;

        if (typeof rawAmount === 'number') {
            amountValue = rawAmount;
        } else if (typeof rawAmount === 'string') {
            const cleaned = rawAmount.replace(/[^\d.-]/g, '');
            const parsed = Number(cleaned);
            amountValue = Number.isFinite(parsed) ? parsed : 0;
        }

        const type =
            ((record.type as string | undefined)?.toLowerCase() as TransactionType) ??
            'credit';
        const status =
            ((record.status as string | undefined)?.toLowerCase() as TransactionStatus) ??
            'pending';

        const createdAt =
            (record.createdAt as string | undefined) ??
            (record.created_at as string | undefined) ??
            null;

        return {
            id:
                (record.id as number | string | undefined) ??
                `transaction-${index}`,
            reference:
                (record.reference as string | undefined) ??
                (record.transactionReference as string | undefined) ??
                `TRX-${index}`,
            amount: amountValue,
            type: type === 'debit' ? 'debit' : 'credit',
            status: ['successful', 'pending', 'failed'].includes(status)
                ? status
                : 'pending',
            paymentMethod:
                (record.paymentMethod as string | undefined) ??
                (record.payment_method as string | undefined) ??
                null,
            description:
                (record.description as string | undefined) ??
                (record.note as string | undefined) ??
                null,
            createdAt,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                null,
        };
    });
};

const normalizeAccounts = (shared: SharedData['auth']['user']): AccountOption[] => {
    const unsafeAccounts =
        ((shared as unknown as Record<string, unknown>)?.accounts as unknown) ??
        [];

    if (!Array.isArray(unsafeAccounts)) {
        return [];
    }

    return unsafeAccounts
        .map((account, index) => {
            if (typeof account !== 'object' || account === null) {
                return null;
            }

            const record = account as Record<string, unknown>;
            const accountNumber =
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined);

            if (!accountNumber) {
                return null;
            }

            const label =
                (record.name as string | undefined) ??
                `Account ${accountNumber.slice(-4)}`;

            return {
                id: (record.id as number | string | undefined) ?? `account-${index}`,
                accountNumber,
                label,
            };
        })
        .filter((account): account is AccountOption => account !== null);
};

const Transactions = () => {
    const page = usePage<SharedData>();
    const user = page.props.auth?.user;
    const accountOptions = useMemo(() => normalizeAccounts(user), [user]);
    const defaultAccount = accountOptions[0]?.accountNumber ?? '';

    const [activeAccountNumber, setActiveAccountNumber] = useState<string>(
        defaultAccount,
    );
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>(
        'all',
    );
    const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');

    useEffect(() => {
        if (!activeAccountNumber) {
            setTransactions([]);
            return;
        }

        let isMounted = true;

        const fetchTransactions = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of TRANSACTION_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        params: { accountId: activeAccountNumber },
                        withCredentials: true,
                    });

                    const payload =
                        (data?.transactions as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const normalised = normalizeTransactions(payload);

                    if (isMounted && (normalised.length > 0 || Array.isArray(payload))) {
                        setTransactions(normalised);
                        setLoading(false);
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint ===
                        TRANSACTION_ENDPOINTS[TRANSACTION_ENDPOINTS.length - 1]
                    ) {
                        if (isMounted) {
                            setError(
                                'We could not load your transactions. Please try again later.',
                            );
                        }
                    }
                }
            }

            if (isMounted) {
                setTransactions([]);
                setLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            isMounted = false;
        };
    }, [activeAccountNumber]);

    useEffect(() => {
        if (!activeAccountNumber && defaultAccount) {
            setActiveAccountNumber(defaultAccount);
        }
    }, [defaultAccount, activeAccountNumber]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesSearch =
                transaction.reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (transaction.description ?? '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || transaction.status === statusFilter;

            const matchesType =
                typeFilter === 'all' || transaction.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [transactions, searchTerm, statusFilter, typeFilter]);

    const totalCredits = useMemo(
        () =>
            transactions
                .filter(
                    (transaction) =>
                        transaction.type === 'credit' &&
                        transaction.status === 'successful',
                )
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [transactions],
    );

    const totalDebits = useMemo(
        () =>
            transactions
                .filter(
                    (transaction) =>
                        transaction.type === 'debit' &&
                        transaction.status === 'successful',
                )
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [transactions],
    );

    const handleExport = () => {
        window.alert('Export functionality coming soon!');
    };

    return (
        <>
            <Head title="Transactions" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Transactions
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Explore your recent credits and debits, filter by status, and keep track of your account activity.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Total Credits
                                </p>
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-green-600">
                                ₦{totalCredits.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Total Debits
                                </p>
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-red-600">
                                ₦{totalDebits.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Account
                                </label>
                                <select
                                    value={activeAccountNumber}
                                    onChange={(event) =>
                                        setActiveAccountNumber(event.target.value)
                                    }
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    {accountOptions.length === 0 ? (
                                        <option value="">No accounts available</option>
                                    ) : (
                                        accountOptions.map((account) => (
                                            <option
                                                key={account.id}
                                                value={account.accountNumber}
                                            >
                                                {account.label} ({account.accountNumber})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="sr-only" htmlFor="transaction-search">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="transaction-search"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                        placeholder="Search by reference or description..."
                                        className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Filters
                                </label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target.value as typeof statusFilter,
                                            )
                                        }
                                        className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="successful">Successful</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                    <select
                                        value={typeFilter}
                                        onChange={(event) =>
                                            setTypeFilter(
                                                event.target.value as typeof typeFilter,
                                            )
                                        }
                                        className="flex-1 rounded-md border border-gray-300 px-2 py-2 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">Credits</option>
                                        <option value="debit">Debits</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="px-6 py-16 text-center text-gray-600">
                                    Loading transactions...
                                </div>
                            ) : error ? (
                                <div className="px-6 py-16 text-center text-red-600">
                                    {error}
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="px-6 py-16 text-center text-gray-500">
                                    No transactions match your filters.
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Reference
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Payment Method
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((transaction) => (
                                            <tr
                                                key={transaction.id}
                                                className="border-t border-gray-100 transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-3 font-mono text-xs text-gray-800">
                                                    {transaction.reference}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {transaction.description ?? '—'}
                                                </td>
                                                <td className="px-6 py-3 capitalize text-gray-700">
                                                    {transaction.type}
                                                </td>
                                                <td className="px-6 py-3 capitalize text-gray-700">
                                                    {transaction.paymentMethod ?? 'N/A'}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            transaction.status === 'successful'
                                                                ? 'bg-green-100 text-green-700'
                                                                : transaction.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                                    ₦{transaction.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {transaction.createdAt
                                                        ? new Date(transaction.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Transactions;
