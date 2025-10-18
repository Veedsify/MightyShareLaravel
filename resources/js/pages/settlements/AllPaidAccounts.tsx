import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Download, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PaidAccount = {
    id: number | string;
    accountNumber: string;
    amount: number;
    settlementDate: string | null;
    reference: string;
    paymentMethod?: string | null;
};

const PAID_ACCOUNT_ENDPOINTS = [
    '/api/settlements/paid-accounts',
    '/api/settlements/paid_accounts',
    '/api/settlements?status=paid',
];

const normalizePaidAccounts = (accounts: unknown): PaidAccount[] => {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map((account, index) => {
        if (typeof account !== 'object' || account === null) {
            return {
                id: `paid-account-${index}`,
                accountNumber: 'Unknown',
                amount: 0,
                settlementDate: null,
                reference: 'N/A',
                paymentMethod: null,
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

        const settlementDate =
            (record.settlementDate as string | undefined) ??
            (record.settlement_date as string | undefined) ??
            null;

        return {
            id:
                (record.id as number | string | undefined) ??
                `paid-account-${index}`,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                'Unknown',
            amount: amountValue,
            settlementDate,
            reference:
                (record.reference as string | undefined) ??
                (record.transactionReference as string | undefined) ??
                `REF-${index}`,
            paymentMethod:
                (record.paymentMethod as string | undefined) ??
                (record.payment_method as string | undefined) ??
                null,
        };
    });
};

const AllPaidAccounts = () => {
    const [accounts, setAccounts] = useState<PaidAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of PAID_ACCOUNT_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        withCredentials: true,
                    });

                    const payload =
                        (data?.paidAccounts as unknown) ??
                        (data?.accounts as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const normalised = normalizePaidAccounts(payload);

                    if (isMounted && (normalised.length > 0 || Array.isArray(payload))) {
                        setAccounts(normalised);
                        setLoading(false);
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint === PAID_ACCOUNT_ENDPOINTS[
                            PAID_ACCOUNT_ENDPOINTS.length - 1
                        ]
                    ) {
                        if (isMounted) {
                            setError(
                                'Unable to load paid settlement accounts right now. Please try again later.',
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
        if (!searchTerm) {
            return accounts;
        }

        const lowerQuery = searchTerm.toLowerCase();
        return accounts.filter(
            (account) =>
                account.accountNumber.toLowerCase().includes(lowerQuery) ||
                account.reference.toLowerCase().includes(lowerQuery),
        );
    }, [accounts, searchTerm]);

    const totalAmountPaid = useMemo(
        () => filteredAccounts.reduce((sum, account) => sum + account.amount, 0),
        [filteredAccounts],
    );

    const thisMonthCount = useMemo(() => {
        const now = new Date();

        return filteredAccounts.filter((account) => {
            if (!account.settlementDate) {
                return false;
            }

            const settlement = new Date(account.settlementDate);

            return (
                settlement.getMonth() === now.getMonth() &&
                settlement.getFullYear() === now.getFullYear()
            );
        }).length;
    }, [filteredAccounts]);

    const handleExport = () => {
        window.alert('Export functionality coming soon!');
    };

    return (
        <>
            <Head title="All Paid Accounts - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            All Paid Settlement Accounts
                        </h1>
                        <p className="text-sm text-gray-600">
                            View the history of settled payouts and confirmed settlement batches.
                        </p>
                    </div>

                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by account number or reference..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 md:self-start"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
                            <p className="text-sm text-blue-800">Total Paid Accounts</p>
                            <p className="mt-2 text-3xl font-bold text-blue-900">
                                {accounts.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-green-100 bg-green-50 p-5">
                            <p className="text-sm text-green-700">Total Amount Paid</p>
                            <p className="mt-2 text-3xl font-bold text-green-900">
                                ₦{totalAmountPaid.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-purple-100 bg-purple-50 p-5">
                            <p className="text-sm text-purple-700">Paid This Month</p>
                            <p className="mt-2 text-3xl font-bold text-purple-900">
                                {thisMonthCount}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="px-6 py-16 text-center text-gray-600">
                                    Loading paid accounts...
                                </div>
                            ) : error ? (
                                <div className="px-6 py-16 text-center text-red-600">
                                    {error}
                                </div>
                            ) : filteredAccounts.length === 0 ? (
                                <div className="px-6 py-16 text-center text-gray-500">
                                    No paid settlement accounts found.
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Reference
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Account Number
                                            </th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Settlement Date
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Payment Method
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAccounts.map((account) => (
                                            <tr
                                                key={account.id}
                                                className="border-t border-gray-100 transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-3 font-mono text-xs text-gray-800">
                                                    {account.reference}
                                                </td>
                                                <td className="px-6 py-3 text-gray-900">
                                                    {account.accountNumber}
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                                    ₦{account.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {account.settlementDate
                                                        ? new Date(
                                                              account.settlementDate,
                                                          ).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-6 py-3 text-gray-700">
                                                    {account.paymentMethod ?? 'N/A'}
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

export default AllPaidAccounts;
