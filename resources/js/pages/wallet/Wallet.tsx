import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    Eye,
    EyeOff,
    Plus,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

type Transaction = {
    id: string;
    type: 'credit' | 'debit';
    description: string;
    amount: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
};

const Wallet = () => {
    const [balanceVisible, setBalanceVisible] = useState(true);

    const balance = 2458500.0;
    const formattedBalance = `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

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
            label: 'Deposit',
            icon: ArrowDownLeft,
            color: 'bg-blue-600 hover:bg-blue-700',
            href: '/wallet/deposit',
        },
        {
            label: 'Withdraw',
            icon: ArrowUpRight,
            color: 'bg-pink-600 hover:bg-pink-700',
            href: '/wallet/withdraw',
        },
        {
            label: 'Add Account',
            icon: Plus,
            color: 'bg-blue-500 hover:bg-blue-600',
            href: '/accounts/add',
        },
    ];

    const stats = [
        {
            label: 'Total Deposits',
            value: '₦850,000.00',
            change: '+12.5%',
            trend: 'up',
        },
        {
            label: 'Total Withdrawals',
            value: '₦320,000.00',
            change: '-5.2%',
            trend: 'down',
        },
        {
            label: 'This Month',
            value: '₦180,000.00',
            change: '+8.3%',
            trend: 'up',
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

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <p className="mb-2 text-sm text-gray-600">
                                    {stat.label}
                                </p>
                                <p className="mb-2 text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <div
                                    className={cn(
                                        'flex items-center gap-1 text-sm font-medium',
                                        stat.trend === 'up'
                                            ? 'text-green-600'
                                            : 'text-red-600',
                                    )}
                                >
                                    <TrendingUp
                                        className={cn(
                                            'h-4 w-4',
                                            stat.trend === 'down' &&
                                                'rotate-180',
                                        )}
                                    />
                                    {stat.change}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Transactions */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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

                    {/* Linked Accounts */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Linked Accounts
                            </h3>
                            <Link
                                href="/accounts/add"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Add Account
                            </Link>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md bg-blue-100 p-2">
                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Access Bank
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            •••• 4567
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    Primary
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md bg-pink-100 p-2">
                                        <CreditCard className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            GTBank
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            •••• 8901
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Wallet;
