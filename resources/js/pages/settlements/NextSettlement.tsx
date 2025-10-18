import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type SettlementCycle = 'weekly' | 'monthly' | 'quarterly' | string;

type NextSettlementAccount = {
    id: number | string;
    accountNumber: string;
    amount: number;
    scheduledDate: string | null;
    settlementCycle: SettlementCycle;
    priority: 'high' | 'normal' | 'low' | string;
    status: string;
};

const NEXT_SETTLEMENT_ENDPOINTS = [
    '/api/settlements/next-settlement',
    '/api/settlements/next_settlement',
    '/api/settlements?status=upcoming',
];

const normalizeAccounts = (accounts: unknown): NextSettlementAccount[] => {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map((account, index) => {
        if (typeof account !== 'object' || account === null) {
            return {
                id: `next-settlement-${index}`,
                accountNumber: 'N/A',
                amount: 0,
                scheduledDate: null,
                settlementCycle: 'monthly',
                priority: 'normal',
                status: 'scheduled',
            };
        }

        const record = account as Record<string, unknown>;
        const rawAmount = record.amount;
        let amountValue = 0;

        if (typeof rawAmount === 'number') {
            amountValue = rawAmount;
        } else if (typeof rawAmount === 'string') {
            const cleaned = rawAmount.replace(/[^\d.-]/g, '');
            const parsed = Number(cleaned);
            amountValue = Number.isFinite(parsed) ? parsed : 0;
        }

        const scheduledDate =
            (record.scheduledDate as string | undefined) ??
            (record.scheduled_date as string | undefined) ??
            (record.nextSettlementDate as string | undefined) ??
            null;

        const cycle =
            (record.settlementCycle as string | undefined) ??
            (record.settlement_cycle as string | undefined) ??
            'monthly';

        return {
            id:
                (record.id as number | string | undefined) ??
                `next-settlement-${index}`,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                'N/A',
            amount: amountValue,
            scheduledDate,
            settlementCycle: cycle.toLowerCase(),
            priority:
                (record.priority as string | undefined)?.toLowerCase() ??
                'normal',
            status:
                (record.status as string | undefined) ??
                (record.state as string | undefined) ??
                'scheduled',
        };
    });
};

const getCycleBadgeClass = (cycle: SettlementCycle) => {
    switch (cycle) {
        case 'weekly':
            return 'bg-blue-100 text-blue-800';
        case 'monthly':
            return 'bg-green-100 text-green-800';
        case 'quarterly':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityClass = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'text-red-600 font-semibold';
        case 'normal':
            return 'text-gray-600';
        case 'low':
            return 'text-gray-400';
        default:
            return 'text-gray-600';
    }
};

const calculateDaysUntil = (date: string | null) => {
    if (!date) {
        return null;
    }

    const today = new Date();
    const target = new Date(date);
    const difference = target.getTime() - today.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const NextSettlement = () => {
    const [accounts, setAccounts] = useState<NextSettlementAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<'all' | SettlementCycle>('all');

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of NEXT_SETTLEMENT_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        withCredentials: true,
                    });

                    const payload =
                        (data?.nextSettlementAccounts as unknown) ??
                        (data?.accounts as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const normalised = normalizeAccounts(payload);

                    if (isMounted && (normalised.length > 0 || Array.isArray(payload))) {
                        setAccounts(normalised);
                        setLoading(false);
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint ===
                        NEXT_SETTLEMENT_ENDPOINTS[
                            NEXT_SETTLEMENT_ENDPOINTS.length - 1
                        ]
                    ) {
                        if (isMounted) {
                            setError(
                                'We could not load the upcoming settlement schedule. Please try again later.',
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

    const filteredAccounts = useMemo(() => {
        if (filter === 'all') {
            return accounts;
        }
        return accounts.filter(
            (account) => account.settlementCycle === filter,
        );
    }, [accounts, filter]);

    const totalAmount = useMemo(
        () => filteredAccounts.reduce((sum, account) => sum + account.amount, 0),
        [filteredAccounts],
    );

    const cycleCounts = useMemo(() => {
        return {
            weekly: accounts.filter((account) => account.settlementCycle === 'weekly').length,
            monthly: accounts.filter((account) => account.settlementCycle === 'monthly').length,
            quarterly: accounts.filter((account) => account.settlementCycle === 'quarterly').length,
        };
    }, [accounts]);

    return (
        <>
            <Head title="Accounts for Next Settlement" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Accounts for Next Settlement
                        </h1>
                        <p className="text-sm text-gray-600">
                            Review accounts queued for the next settlement cycle and plan payouts ahead of time.
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
                            <p className="text-sm text-blue-700">Total Accounts</p>
                            <p className="mt-2 text-3xl font-bold text-blue-900">
                                {accounts.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-green-100 bg-green-50 p-5">
                            <p className="text-sm text-green-700">Total Amount</p>
                            <p className="mt-2 text-3xl font-bold text-green-900">
                                ₦{totalAmount.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-purple-100 bg-purple-50 p-5">
                            <p className="text-sm text-purple-700">Weekly Cycle</p>
                            <p className="mt-2 text-3xl font-bold text-purple-900">
                                {cycleCounts.weekly}
                            </p>
                        </div>
                        <div className="rounded-lg border border-orange-100 bg-orange-50 p-5">
                            <p className="text-sm text-orange-700">Monthly Cycle</p>
                            <p className="mt-2 text-3xl font-bold text-orange-900">
                                {cycleCounts.monthly}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                        {[
                            { label: 'All Cycles', value: 'all' },
                            { label: 'Weekly', value: 'weekly' },
                            { label: 'Monthly', value: 'monthly' },
                            { label: 'Quarterly', value: 'quarterly' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setFilter(option.value as typeof filter)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    filter === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="px-6 py-16 text-center text-gray-600">
                                    Loading upcoming settlements...
                                </div>
                            ) : error ? (
                                <div className="px-6 py-16 text-center text-red-600">
                                    {error}
                                </div>
                            ) : filteredAccounts.length === 0 ? (
                                <div className="px-6 py-16 text-center text-gray-500">
                                    No accounts scheduled for this cycle.
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Account Number
                                            </th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Scheduled Date
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Days Until
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Cycle
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAccounts.map((account) => {
                                            const daysUntil = calculateDaysUntil(
                                                account.scheduledDate,
                                            );
                                            return (
                                                <tr
                                                    key={account.id}
                                                    className="border-t border-gray-100 transition hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-3 text-gray-900">
                                                        {account.accountNumber}
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                                        ₦{account.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-700">
                                                        {account.scheduledDate ? (
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                                {new Date(
                                                                    account.scheduledDate,
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-center text-gray-700">
                                                        {typeof daysUntil === 'number' ? (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                <span
                                                                    className={
                                                                        daysUntil <= 3
                                                                            ? 'font-semibold text-red-600'
                                                                            : 'font-semibold text-gray-700'
                                                                    }
                                                                >
                                                                    {daysUntil} days
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            '—'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getCycleBadgeClass(
                                                                account.settlementCycle,
                                                            )}`}
                                                        >
                                                            {account.settlementCycle.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className={`px-6 py-3 text-center uppercase ${getPriorityClass(
                                                            account.priority,
                                                        )}`}
                                                    >
                                                        {account.priority}
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className="capitalize text-green-600">
                                                            {account.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

export default NextSettlement;
