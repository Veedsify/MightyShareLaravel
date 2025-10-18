import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownLeft,
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
    is_paid: boolean;
};

type WalletData = {
    staticAccountBalance: number;
    hasStaticAccount: boolean;
    staticAccountNumber?: string;
    staticAccountBank?: string;
    unpaidAccountsCount: number;
    totalInitialPaymentRequired: number;
    packagePrice: number;
    minContribution: number;
    packageName: string;
    accounts: WalletAccount[];
};

interface WalletPageProps extends SharedData {
    walletData: WalletData;
}

type Transaction = {
    id: string;
    type: 'credit' | 'debit';
    description: string;
    amount: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
};

const Wallet = () => {
    const { walletData } = usePage<WalletPageProps>().props;
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [topupAmount, setTopupAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formattedBalance = `₦${walletData.staticAccountBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const formattedPackagePrice = `₦${walletData.packagePrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const formattedMinContribution = `₦${walletData.minContribution.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

    const handleTopup = () => {
        // Check if user has static account
        if (!walletData.hasStaticAccount) {
            alert(
                'You need to generate a static account first. Please go to Settings.',
            );
            return;
        }
        setTopupAmount('');
        setShowTopupModal(true);
    };

    const processTopup = () => {
        if (!topupAmount) return;

        const amount = Math.round(parseFloat(topupAmount));

        // Validation based on unpaid accounts
        if (walletData.unpaidAccountsCount > 0) {
            if (amount < walletData.totalInitialPaymentRequired) {
                alert(
                    `You have ${walletData.unpaidAccountsCount} unpaid account(s). Minimum required: ${formattedPackagePrice} × ${walletData.unpaidAccountsCount} = ₦${walletData.totalInitialPaymentRequired.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
                );
                return;
            }
        } else {
            // Check minimum contribution
            if (amount < walletData.minContribution) {
                alert(`Minimum top-up amount is ${formattedMinContribution}`);
                return;
            }
        }

        setIsProcessing(true);

        router.post(
            '/dashboard/wallet/topup',
            {
                amount: amount,
            },
            {
                onSuccess: () => {
                    setShowTopupModal(false);
                    setTopupAmount('');
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const recentTransactions: Transaction[] = [
        {
            id: '1',
            type: 'credit',
            description: 'Deposit from Access Bank',
            amount: '₦50,000.00',
            date: '2 hours ago',
            status: 'completed',
        },
        {
            id: '2',
            type: 'debit',
            description: 'Withdrawal to GTBank',
            amount: '₦25,000.00',
            date: '5 hours ago',
            status: 'pending',
        },
        {
            id: '3',
            type: 'credit',
            description: 'Thrift package return',
            amount: '₦100,000.00',
            date: '1 day ago',
            status: 'completed',
        },
        {
            id: '4',
            type: 'debit',
            description: 'Package subscription',
            amount: '₦15,000.00',
            date: '2 days ago',
            status: 'completed',
        },
        {
            id: '5',
            type: 'credit',
            description: 'Deposit from Zenith Bank',
            amount: '₦75,000.00',
            date: '3 days ago',
            status: 'completed',
        },
    ];

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
                        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900">
                                        Initial Payment Required
                                    </h3>
                                    <p className="mt-1 text-sm text-orange-800">
                                        You have{' '}
                                        {walletData.unpaidAccountsCount} unpaid
                                        account
                                        {walletData.unpaidAccountsCount > 1
                                            ? 's'
                                            : ''}
                                        . Each account requires an initial
                                        payment of {formattedPackagePrice} (
                                        {walletData.packageName}). Total
                                        required:{' '}
                                        <strong>
                                            ₦
                                            {walletData.totalInitialPaymentRequired.toLocaleString(
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

                    {/* Balance Card */}
                    <div className="mb-6 rounded-lg bg-blue-600 p-8 text-white shadow-lg">
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
                                    'flex flex-col items-center justify-center rounded-lg p-6 text-white shadow-md transition-all duration-200 hover:shadow-lg',
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
                    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
                                    (account, idx: number) => {
                                        const accountBalance = `₦${(account.balance / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
                                        return (
                                            <div
                                                key={account.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
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
                                                                account.account_number
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Balance:{' '}
                                                            {accountBalance}
                                                        </p>
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
                                                    {idx === 0 && (
                                                        <button
                                                            onClick={() =>
                                                                handleTopup()
                                                            }
                                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                            type="button"
                                                        >
                                                            Top Up
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )
                            ) : (
                                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
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

                    {/* Recent Transactions */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Recent Transactions
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Your latest wallet activities
                                </p>
                            </div>
                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                'rounded-full p-3',
                                                transaction.type === 'credit'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600',
                                            )}
                                        >
                                            {transaction.type === 'credit' ? (
                                                <ArrowDownLeft className="h-5 w-5" />
                                            ) : (
                                                <ArrowUpRight className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {transaction.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={cn(
                                                'text-lg font-semibold',
                                                transaction.type === 'credit'
                                                    ? 'text-green-600'
                                                    : 'text-red-600',
                                            )}
                                        >
                                            {transaction.type === 'credit'
                                                ? '+'
                                                : '-'}
                                            {transaction.amount}
                                        </p>
                                        <span
                                            className={cn(
                                                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                transaction.status ===
                                                    'completed' &&
                                                    'bg-green-100 text-green-700',
                                                transaction.status ===
                                                    'pending' &&
                                                    'bg-yellow-100 text-yellow-700',
                                                transaction.status ===
                                                    'failed' &&
                                                    'bg-red-100 text-red-700',
                                            )}
                                        >
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top-up Modal */}
                    {showTopupModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                                <h3 className="mb-4 text-xl font-bold text-gray-900">
                                    Top Up Wallet
                                </h3>
                                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-600">
                                        Static Account Number
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {walletData.staticAccountNumber}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Bank
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {walletData.staticAccountBank}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Current Balance
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {formattedBalance}
                                    </p>
                                    {walletData.unpaidAccountsCount > 0 && (
                                        <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3">
                                            <p className="text-sm font-medium text-orange-900">
                                                {walletData.unpaidAccountsCount}{' '}
                                                Unpaid Account(s)
                                            </p>
                                            <p className="mt-1 text-xs text-orange-700">
                                                Minimum deposit: ₦
                                                {walletData.totalInitialPaymentRequired.toLocaleString(
                                                    'en-NG',
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}{' '}
                                                (
                                                {walletData.unpaidAccountsCount}{' '}
                                                × {formattedPackagePrice})
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="amount"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Amount (₦)
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={topupAmount}
                                        onChange={(e) =>
                                            setTopupAmount(e.target.value)
                                        }
                                        placeholder={
                                            walletData.unpaidAccountsCount > 0
                                                ? `Min: ${walletData.totalInitialPaymentRequired.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
                                                : `Min: ${formattedMinContribution}`
                                        }
                                        min="1"
                                        step="1"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowTopupModal(false);
                                            setTopupAmount('');
                                        }}
                                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={processTopup}
                                        disabled={isProcessing || !topupAmount}
                                        className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                        type="button"
                                    >
                                        {isProcessing
                                            ? 'Processing...'
                                            : 'Top Up'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default Wallet;
