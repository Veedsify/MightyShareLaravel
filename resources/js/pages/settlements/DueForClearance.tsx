import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ClearanceStatus = 'pending' | 'processing' | 'cleared';

type ClearanceAccount = {
    id: number | string;
    accountNumber: string;
    accountName: string;
    amount: number;
    bankName?: string | null;
    dueDate: string | null;
    status: ClearanceStatus;
    priority: 'high' | 'normal' | 'low' | string;
    notes?: string | null;
};

const CLEARANCE_ENDPOINTS = [
    '/api/settlements/due-clearance',
    '/api/settlements/due_clearance',
    '/api/settlements?status=due',
];

const normalizeClearanceAccounts = (accounts: unknown): ClearanceAccount[] => {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map((account, index) => {
        if (typeof account !== 'object' || account === null) {
            return {
                id: `due-clearance-${index}`,
                accountNumber: 'N/A',
                accountName: 'Unknown',
                amount: 0,
                bankName: null,
                dueDate: null,
                status: 'pending',
                priority: 'normal',
                notes: null,
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

        const status =
            ((record.status as string | undefined)?.toLowerCase() as ClearanceStatus) ??
            'pending';

        const dueDate =
            (record.dueDate as string | undefined) ??
            (record.due_date as string | undefined) ??
            null;

        return {
            id:
                (record.id as number | string | undefined) ??
                `due-clearance-${index}`,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                'N/A',
            accountName:
                (record.accountName as string | undefined) ??
                (record.account_name as string | undefined) ??
                'Unknown',
            amount: amountValue,
            bankName:
                (record.bankName as string | undefined) ??
                (record.bank_name as string | undefined) ??
                null,
            dueDate,
            status: ['pending', 'processing', 'cleared'].includes(status)
                ? status
                : 'pending',
            priority:
                (record.priority as string | undefined)?.toLowerCase() ??
                'normal',
            notes:
                (record.notes as string | undefined) ??
                (record.comment as string | undefined) ??
                null,
        };
    });
};

const getStatusIcon = (status: ClearanceStatus) => {
    switch (status) {
        case 'pending':
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'processing':
            return <AlertCircle className="h-4 w-4 text-blue-500" />;
        case 'cleared':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
            return null;
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

const DueForClearance = () => {
    const [accounts, setAccounts] = useState<ClearanceAccount[]>([]);
    const [filter, setFilter] = useState<'all' | ClearanceStatus>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of CLEARANCE_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        withCredentials: true,
                    });

                    const payload =
                        (data?.clearanceAccounts as unknown) ??
                        (data?.accounts as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const normalised = normalizeClearanceAccounts(payload);

                    if (isMounted && (normalised.length > 0 || Array.isArray(payload))) {
                        setAccounts(normalised);
                        setLoading(false);
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint ===
                        CLEARANCE_ENDPOINTS[CLEARANCE_ENDPOINTS.length - 1]
                    ) {
                        if (isMounted) {
                            setError(
                                'We could not load accounts due for clearance. Please try again later.',
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
        return accounts.filter((account) => account.status === filter);
    }, [accounts, filter]);

    return (
        <>
            <Head title="Due for Clearance - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Accounts Due for Clearance
                        </h1>
                        <p className="text-sm text-gray-600">
                            Monitor settlement accounts scheduled for processing and follow-up actions.
                        </p>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                        {[
                            { label: 'All', value: 'all' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Processing', value: 'processing' },
                            { label: 'Cleared', value: 'cleared' },
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
                                    Loading accounts due for clearance...
                                </div>
                            ) : error ? (
                                <div className="px-6 py-16 text-center text-red-600">
                                    {error}
                                </div>
                            ) : filteredAccounts.length === 0 ? (
                                <div className="px-6 py-16 text-center text-gray-500">
                                    No accounts found for this filter.
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Account Number
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Account Name
                                            </th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Due Date
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAccounts.map((account) => (
                                            <tr
                                                key={account.id}
                                                className="border-t border-gray-100 transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-3 text-gray-900">
                                                    {account.accountNumber}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {account.accountName}
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                                    ₦{account.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {account.dueDate
                                                        ? new Date(account.dueDate).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                                <td
                                                    className={`px-6 py-3 text-center uppercase ${getPriorityClass(
                                                        account.priority,
                                                    )}`}
                                                >
                                                    {account.priority}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getStatusIcon(account.status)}
                                                        <span className="capitalize text-gray-700">
                                                            {account.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            window.alert(
                                                                'Processing actions will be available soon.',
                                                            )
                                                        }
                                                        className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-blue-700"
                                                    >
                                                        Process
                                                    </button>
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

export default DueForClearance;
