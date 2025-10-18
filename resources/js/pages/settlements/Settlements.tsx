import axios from 'axios';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type SettlementAccount = {
    id: number | string;
    bankName?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    isDefault?: boolean | null;
    isVerified?: boolean | null;
    createdAt?: string | null;
};

type SettlementsPageProps = {
    accounts?: SettlementAccount[];
};

const FALLBACK_ENDPOINTS = [
    '/api/settlement-accounts',
    '/api/accounts',
    '/api/settlements/accounts',
];

const normalizeAccounts = (accounts: unknown): SettlementAccount[] => {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map((account, index) => {
        if (typeof account !== 'object' || account === null) {
            return {
                id: `fallback-${index}`,
                bankName: 'Unknown Bank',
                accountNumber: null,
                accountName: null,
                isDefault: false,
                isVerified: false,
                createdAt: null,
            };
        }

        const record = account as Record<string, unknown>;

        return {
            id:
                (record.id as number | string | undefined) ??
                `account-${index}`,
            bankName:
                (record.bankName as string | undefined) ??
                (record.bank_name as string | undefined) ??
                null,
            accountNumber:
                (record.accountNumber as string | undefined) ??
                (record.account_number as string | undefined) ??
                null,
            accountName:
                (record.accountName as string | undefined) ??
                (record.account_name as string | undefined) ??
                null,
            isDefault: Boolean(
                (record.isDefault as boolean | undefined) ??
                    (record.is_default as boolean | undefined) ??
                    false,
            ),
            isVerified: Boolean(
                (record.isVerified as boolean | undefined) ??
                    (record.is_verified as boolean | undefined) ??
                    false,
            ),
            createdAt:
                (record.createdAt as string | undefined) ??
                (record.created_at as string | undefined) ??
                null,
        };
    });
};

const Settlements = () => {
    const { props } = usePage<SettlementsPageProps>();
    const initialAccounts = props.accounts ?? [];
    const [accounts, setAccounts] = useState<SettlementAccount[]>(
        normalizeAccounts(initialAccounts),
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setLoading(true);
            setError('');

            for (const endpoint of FALLBACK_ENDPOINTS) {
                try {
                    const { data } = await axios.get(endpoint, {
                        withCredentials: true,
                    });

                    const payload =
                        (data?.accounts as unknown) ??
                        (data?.data as unknown) ??
                        data;
                    const nextAccounts = normalizeAccounts(payload);

                    if (nextAccounts.length > 0 || Array.isArray(payload)) {
                        if (isMounted) {
                            setAccounts(nextAccounts);
                            setLoading(false);
                        }
                        return;
                    }
                } catch (requestError) {
                    if (
                        endpoint ===
                        FALLBACK_ENDPOINTS[FALLBACK_ENDPOINTS.length - 1]
                    ) {
                        if (isMounted) {
                            setError(
                                'We could not load your settlement accounts. Please try again shortly.',
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

    const handleAddAccount = () => {
        router.visit('/dashboard/settlements/add');
    };

    const hasAccounts = accounts.length > 0;

    return (
        <>
            <Head title="Manage Settlement Accounts" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Manage Settlement Accounts
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                View, update, or remove the settlement accounts
                                linked to your MightyShare profile.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/settlements/add"
                                className="hidden rounded-md border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 md:inline-flex"
                            >
                                Create New Account
                            </Link>
                            <button
                                onClick={handleAddAccount}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                type="button"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Account
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Loading settlement accounts...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {!hasAccounts && !error ? (
                                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        No settlement accounts yet
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Add your first settlement account to get
                                        started with payouts.
                                    </p>
                                    <button
                                        onClick={handleAddAccount}
                                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                        type="button"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Account
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
                                        >
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {account.bankName ??
                                                            'Settlement Account'}
                                                    </h3>
                                                    {account.isDefault && (
                                                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                            Default
                                                        </span>
                                                    )}
                                                    {account.isVerified && (
                                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-700">
                                                    {account.accountName ??
                                                        'Unnamed Account'}
                                                </p>
                                                <p className="text-xs font-mono text-gray-500">
                                                    {account.accountNumber ??
                                                        'Account details unavailable'}
                                                </p>
                                                {account.createdAt && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Added:{' '}
                                                        {new Date(
                                                            account.createdAt,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                                    type="button"
                                                    onClick={() =>
                                                        window.alert(
                                                            'Editing settlement accounts will be available soon.',
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                    type="button"
                                                    onClick={() =>
                                                        window.alert(
                                                            'Removing settlement accounts will be available soon.',
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export { Settlements };
