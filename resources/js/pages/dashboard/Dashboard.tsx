import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Package,
    TrendingDown,
    TrendingUp,
    User,
    Wallet,
} from 'lucide-react';

type StatCard = {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
    bgColor: string;
};

type QuickAction = {
    label: string;
    icon: LucideIcon;
    href: string;
    color: string;
};

const quickActions: QuickAction[] = [
    {
        label: 'Add Account',
        icon: User,
        href: '/dashboard/accounts/add',
        color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
        label: 'View Wallet',
        icon: Wallet,
        href: '/dashboard/wallet',
        color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
        label: 'Transactions',
        icon: CreditCard,
        href: '/dashboard/transactions',
        color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
        label: 'Packages',
        icon: Package,
        href: '/dashboard/packages',
        color: 'bg-pink-600 hover:bg-pink-700',
    },
];

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        referralId: string;
        registrationPaid: boolean;
        notifications?: unknown[];
        accounts: Array<{
            id: number;
            name: string;
            accountNumber: string;
            balance: string;
            balanceRaw: number;
            totalContributions: number;
            rewards: number;
            totalDebt: number;
            referralEarnings: number;
        }>;
        thriftSubscriptions: Array<{
            id: number;
            packageId: number;
            amountInvested: number;
            status: string;
            package: {
                id: number;
                name: string;
                price: number;
                duration: number;
                profitPercentage: number;
                description?: string;
            } | null;
        }>;
    };
    dashboardStats: {
        totalBalance: string;
        totalTransactions: number;
        totalContributions: string;
        totalRewards: string;
        activePackages: number;
    };
    recentTransactions: Array<{
        id: number;
        type: string;
        amount: string;
        status: string;
        date: string;
        reference: string;
        accountNumber: string;
    }>;
}

const Dashboard = () => {
    const { user, dashboardStats, recentTransactions } = usePage<
        SharedData & DashboardProps
    >().props;

    // Use real user data with proper fallbacks
    const userName = user?.name || 'User';
    const firstName = userName.split(' ')[0] || 'User';

    // Generate stat cards from real data with meaningful change indicators
    const statCards: StatCard[] = [
        {
            title: 'Total Balance',
            value: dashboardStats?.totalBalance || '₦0.00',
            change:
                dashboardStats?.totalBalance !== '₦0.00'
                    ? 'Active'
                    : 'No activity',
            trend: dashboardStats?.totalBalance !== '₦0.00' ? 'up' : 'down',
            icon: Wallet,
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Total Transactions',
            value: dashboardStats?.totalTransactions?.toString() || '0',
            change:
                dashboardStats?.totalTransactions > 0
                    ? `${dashboardStats.totalTransactions} total`
                    : 'No transactions',
            trend: dashboardStats?.totalTransactions > 0 ? 'up' : 'down',
            icon: CreditCard,
            bgColor: 'bg-blue-600',
        },
        {
            title: 'Total Contributions',
            value: dashboardStats?.totalContributions || '₦0.00',
            change:
                dashboardStats?.totalContributions !== '₦0.00'
                    ? 'Contributing'
                    : 'No contributions',
            trend:
                dashboardStats?.totalContributions !== '₦0.00' ? 'up' : 'down',
            icon: DollarSign,
            bgColor: 'bg-pink-500',
        },
        {
            title: 'Active Packages',
            value: dashboardStats?.activePackages?.toString() || '0',
            change:
                dashboardStats?.activePackages > 0
                    ? `${dashboardStats.activePackages} active`
                    : 'No packages',
            trend: dashboardStats?.activePackages > 0 ? 'up' : 'down',
            icon: Package,
            bgColor: 'bg-pink-600',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Welcome Header */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Welcome back, MightyShare{' '}
                            <span className="text-blue-500">
                                {firstName}! 👋
                            </span>
                        </h1>
                        <p className="text-base text-gray-600">
                            Here's what's happening with your accounts today.
                        </p>
                        {!user?.registrationPaid && (
                            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-yellow-100 p-2">
                                        <Package className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-yellow-800">
                                            Complete Your Registration
                                        </h3>
                                        <p className="text-sm text-yellow-700">
                                            Pay your registration fee to unlock
                                            all features
                                        </p>
                                    </div>
                                    <Link href="/register-payment">
                                        <Button
                                            size="sm"
                                            className="bg-yellow-600 text-white hover:bg-yellow-700"
                                        >
                                            Pay Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat) => (
                            <div
                                key={stat.title}
                                className={cn(
                                    'rounded-lg border border-gray-200 p-6 shadow-md transition-all duration-200 hover:shadow-lg',
                                    stat.bgColor,
                                )}
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="rounded-md bg-white/20 p-3">
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-white/90">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-5 text-xl font-bold text-gray-900">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className={cn(
                                        'group flex flex-col items-center justify-center rounded-lg p-6 text-white shadow-md transition-all duration-200 hover:shadow-lg',
                                        action.color,
                                    )}
                                >
                                    <div className="mb-4 rounded-md bg-white/20 p-3 transition-transform group-hover:scale-110">
                                        <action.icon className="h-7 w-7" />
                                    </div>
                                    <span className="text-center text-sm font-medium">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2">
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Recent Transactions
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Your latest transaction history
                                        </p>
                                    </div>
                                    <Link
                                        href="/transactions"
                                        className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        View all
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {recentTransactions &&
                                        recentTransactions.length > 0 ? (
                                            recentTransactions.map(
                                                (transaction) => (
                                                    <div
                                                        key={transaction.id}
                                                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={cn(
                                                                    'rounded-md p-3',
                                                                    transaction.type ===
                                                                        'Deposit' &&
                                                                        'bg-blue-100 text-blue-600',
                                                                    transaction.type ===
                                                                        'Withdrawal' &&
                                                                        'bg-pink-100 text-pink-600',
                                                                    transaction.type ===
                                                                        'Transfer' &&
                                                                        'bg-purple-100 text-purple-600',
                                                                    transaction.type ===
                                                                        'Payment' &&
                                                                        'bg-green-100 text-green-600',
                                                                )}
                                                            >
                                                                <CreditCard className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {
                                                                        transaction.type
                                                                    }
                                                                </p>
                                                                <p className="mt-0.5 text-xs text-gray-600">
                                                                    {
                                                                        transaction.reference
                                                                    }{' '}
                                                                    •{' '}
                                                                    {
                                                                        transaction.date
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {
                                                                    transaction.amount
                                                                }
                                                            </p>
                                                            <span
                                                                className={cn(
                                                                    'mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
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
                                                                {
                                                                    transaction.status
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="py-8 text-center">
                                                <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                                <p className="text-sm text-gray-500">
                                                    No transactions yet
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    Your transaction history
                                                    will appear here
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Cards */}
                        <div className="space-y-5">
                            {/* Account Summary */}
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="border-b border-gray-200 p-6">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Account Summary
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Monthly overview
                                    </p>
                                </div>
                                <div className="space-y-4 p-6">
                                    <div className="rounded-lg bg-blue-600 p-5 shadow-md">
                                        <p className="mb-2 text-sm font-medium text-blue-100">
                                            Total Rewards
                                        </p>
                                        <p className="text-3xl font-bold text-white">
                                            {dashboardStats?.totalRewards ||
                                                '₦0.00'}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-100">
                                            {dashboardStats?.totalRewards !==
                                            '₦0.00' ? (
                                                <TrendingUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <TrendingDown className="h-3.5 w-3.5" />
                                            )}
                                            From thrift packages
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-pink-600 p-5 shadow-md">
                                        <p className="mb-2 text-sm font-medium text-pink-100">
                                            Total Contributions
                                        </p>
                                        <p className="text-3xl font-bold text-white">
                                            {dashboardStats?.totalContributions ||
                                                '₦0.00'}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-pink-100">
                                            {dashboardStats?.totalContributions !==
                                            '₦0.00' ? (
                                                <TrendingUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <TrendingDown className="h-3.5 w-3.5" />
                                            )}
                                            Across all accounts
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <Link href="/wallet" className="w-full">
                                            <Button className="w-full rounded-md py-3 font-medium">
                                                View Detailed Report
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Active Packages */}
                            {user?.thriftSubscriptions &&
                            user.thriftSubscriptions.length > 0 ? (
                                <div className="rounded-lg border border-gray-200 bg-white">
                                    <div className="border-b border-gray-200 p-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Active Packages
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Your current thrift subscriptions
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        {user.thriftSubscriptions.map(
                                            (subscription) => (
                                                <div
                                                    key={subscription.id}
                                                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {subscription
                                                                    .package
                                                                    ?.name ||
                                                                    'Package'}
                                                            </h4>   
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ₦
                                                                {subscription
                                                                    .package
                                                                    ?.price
                                                                    ? (
                                                                          subscription
                                                                              .package
                                                                              .price 
                                                                      ).toLocaleString()
                                                                    : '0'}
                                                            </p>
                                                            <span
                                                                className={cn(
                                                                    'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                                    subscription.status ===
                                                                        'active' &&
                                                                        'bg-green-100 text-green-700',
                                                                    subscription.status ===
                                                                        'inactive' &&
                                                                        'bg-gray-100 text-gray-700',
                                                                    subscription.status ===
                                                                        'expired' &&
                                                                        'bg-red-100 text-red-700',
                                                                )}
                                                            >
                                                                {
                                                                    subscription.status
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {subscription.amountInvested >
                                                        0 && (
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            Invested: ₦
                                                            {(
                                                                subscription.amountInvested /
                                                                100
                                                            ).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                        <div className="border-t border-gray-200 pt-4">
                                            <Link
                                                href="/packages"
                                                className="w-full"
                                            >
                                                <Button className="w-full rounded-md py-3 font-medium">
                                                    View All Packages
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg bg-blue-600 p-6 text-white shadow-md">
                                    <div className="mb-5 inline-block rounded-md bg-white/20 p-4">
                                        <Package className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">
                                        Get Started with Thrift
                                    </h3>
                                    <p className="mb-5 text-sm text-blue-100">
                                        Choose a thrift package and start
                                        earning returns on your investments
                                    </p>
                                    <Link href="/packages">
                                        <Button
                                            variant="secondary"
                                            className="w-full rounded-md bg-white py-3 font-medium text-blue-600 hover:bg-blue-50"
                                        >
                                            Browse Packages
                                        </Button>
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

export default Dashboard;
