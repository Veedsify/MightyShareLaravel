import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    CreditCard,
    Eye,
    EyeOff,
    LucidePiggyBank,
    Plus,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

type WalletAccount = {
    id: number;
    account_number: string;
    balance: number;
    total_contributions: number;
    is_paid: boolean;
    is_primary: boolean;
    created_at?: string;
};

type WalletData = {
    staticAccountBalance: number;
    hasStaticAccount: boolean;
    staticAccountNumber?: string;
    staticAccountBank?: string;
    unpaidAccountsCount: number;
    registrationFee: number;
    totalRegistrationRequired: number;
    pendingRegistrationBalance: number;
    minContribution: number;
    packageName: string;
    accounts: WalletAccount[];
};

interface WalletPageProps extends SharedData {
    walletData: WalletData;
}

const Wallet = () => {
    const { walletData } = usePage<WalletPageProps>().props;
    const [balanceVisible, setBalanceVisible] = useState(true);

    const formattedBalance = `₦${walletData.staticAccountBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const formattedRegistrationFee = `₦${walletData.registrationFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const quickActions = [
        {
            label: 'Static Account',
            icon: LucidePiggyBank,
            color: 'bg-blue-600 hover:bg-blue-700',
            href: '/dashboard/settings',
        },
        {
            label: 'Withdraw',
            icon: ArrowUpRight,
            color: 'bg-pink-600 hover:bg-pink-700',
            href: '/dashboard/wallet/withdraw',
        },
        {
            label: 'Add Account',
            icon: Plus,
            color: 'bg-blue-500 hover:bg-blue-600',
            href: '/dashboard/accounts/add',
        },
    ];

    return (
        <>
            <Head title="Wallet" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Wallet
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage your balance, deposits, and withdrawals
                        </p>
                    </div>

                    {/* Unpaid Accounts Alert */}
                    {walletData.unpaidAccountsCount > 0 && (
                        <div className="mb-6 border border-orange-200 bg-orange-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900">
                                        Registration Fee Required
                                    </h3>
                                    <p className="mt-1 text-sm text-orange-800">
                                        You have{' '}
                                        {walletData.unpaidAccountsCount} unpaid
                                        account
                                        {walletData.unpaidAccountsCount > 1
                                            ? 's'
                                            : ''}
                                        . Each account requires a registration
                                        fee of {formattedRegistrationFee}. Total
                                        required:{' '}
                                        <strong>
                                            ₦
                                            {walletData.totalRegistrationRequired.toLocaleString(
                                                'en-NG',
                                                {
                                                    minimumFractionDigits: 2,
                                                },
                                            )}
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Balances */}
                    {walletData.pendingRegistrationBalance > 0 && (
                        <div className="mb-6 border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-yellow-900">
                                        Pending Balances
                                    </h3>
                                    <p className="mt-1 text-sm text-yellow-800">
                                        Pending registration fees:{' '}
                                        <strong>
                                            ₦{walletData.pendingRegistrationBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </strong>
                                        {' '}— will be deducted on next top-up.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Balance Card */}
                    <div className="relative mb-6 bg-blue-600 p-8 text-white shadow-lg overflow-hidden">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                            <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                            <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size[72px_72px]" />
                        </div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="mb-2 text-sm text-blue-100">
                                    Available Balance
                                </p>
                                <h2 className="text-4xl font-bold">
                                    {balanceVisible
                                        ? formattedBalance
                                        : '₦••••••••'}
                                </h2>
                            </div>
                            <button
                                onClick={() =>
                                    setBalanceVisible(!balanceVisible)
                                }
                                className="rounded-md bg-white/20 p-3 transition-colors hover:bg-white/30"
                                type="button"
                            >
                                {balanceVisible ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-blue-100">
                            <TrendingUp className="h-4 w-4" />
                            <span>+15% from last month</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={cn(
                                    'flex flex-col items-center justify-center p-6 text-white shadow-md transition-all duration-200 hover:shadow-lg',
                                    action.color,
                                )}
                            >
                                <action.icon className="mb-3 h-8 w-8" />
                                <span className="text-sm font-medium">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* My Accounts - Replace Linked Accounts */}
                    <div className="mt-6 border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                My Accounts
                            </h3>
                            <Link
                                href="/dashboard/accounts/add"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Add Account
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {walletData.accounts.length > 0 ? (
                                walletData.accounts.map(
                                    (account) => {
                                        const accountBalance = `₦${(account.balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
                                        return (
                                            <div
                                                key={account.id}
                                                className="flex items-center justify-between border border-gray-200 p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            'rounded-md p-2',
                                                            account.is_paid
                                                                ? 'bg-green-100'
                                                                : 'bg-orange-100',
                                                        )}
                                                    >
                                                        <CreditCard
                                                            className={cn(
                                                                'h-5 w-5',
                                                                account.is_paid
                                                                    ? 'text-green-600'
                                                                    : 'text-orange-600',
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                account.is_primary
                                                                    ? 'Primary - ' + account.account_number :
                                                                    account.account_number
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Balance:{' '}
                                                            {accountBalance}
                                                        </p>
                                                        {account.created_at && (
                                                            <p className="text-xs text-gray-400">
                                                                Created: {new Date(account.created_at).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!account.is_paid && (
                                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                                                            Unpaid
                                                        </span>
                                                    )}
                                                    {account.is_paid && (
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )
                            ) : (
                                <div className="border border-dashed border-gray-300 p-8 text-center">
                                    <p className="text-gray-600">
                                        No accounts found. Create your first
                                        account to get started.
                                    </p>
                                    <Link
                                        href="/dashboard/accounts/add"
                                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Wallet;
