import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowUpRight,
    Bell,
    ChevronDown,
    CreditCard,
    DollarSign,
    Menu,
    Package,
    Search,
    TrendingDown,
    TrendingUp,
    User,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';

type StatCard = {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
    bgColor: string;
};

const statCards: StatCard[] = [
    {
        title: 'Total Balance',
        value: '₦2,458,500.00',
        change: '+12.5%',
        trend: 'up',
        icon: Wallet,
        bgColor: 'bg-blue-500',
    },
    {
        title: 'Total Transactions',
        value: '1,245',
        change: '+8.2%',
        trend: 'up',
        icon: CreditCard,
        bgColor: 'bg-blue-600',
    },
    {
        title: 'Pending Settlements',
        value: '₦125,000.00',
        change: '-3.1%',
        trend: 'down',
        icon: DollarSign,
        bgColor: 'bg-pink-500',
    },
    {
        title: 'Active Packages',
        value: '12',
        change: '+2 new',
        trend: 'up',
        icon: Package,
        bgColor: 'bg-pink-600',
    },
];

type Transaction = {
    id: string;
    type: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
};

const recentTransactions: Transaction[] = [
    {
        id: '1',
        type: 'Deposit',
        amount: '₦50,000.00',
        status: 'completed',
        date: '2 hours ago',
        reference: 'TRX001234567',
    },
    {
        id: '2',
        type: 'Withdrawal',
        amount: '₦25,000.00',
        status: 'pending',
        date: '5 hours ago',
        reference: 'TRX001234568',
    },
    {
        id: '3',
        type: 'Transfer',
        amount: '₦15,000.00',
        status: 'completed',
        date: '1 day ago',
        reference: 'TRX001234569',
    },
    {
        id: '4',
        type: 'Deposit',
        amount: '₦100,000.00',
        status: 'completed',
        date: '2 days ago',
        reference: 'TRX001234570',
    },
    {
        id: '5',
        type: 'Withdrawal',
        amount: '₦30,000.00',
        status: 'failed',
        date: '3 days ago',
        reference: 'TRX001234571',
    },
];

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
        href: '/accounts/add',
        color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
        label: 'View Wallet',
        icon: Wallet,
        href: '/wallet',
        color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
        label: 'Transactions',
        icon: CreditCard,
        href: '/transactions',
        color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
        label: 'Packages',
        icon: Package,
        href: '/packages',
        color: 'bg-pink-600 hover:bg-pink-700',
    },
];

const Dashboard = () => {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const userName = auth?.user?.name || 'User';
    const firstName = userName.split(' ')[0] || 'User';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const accounts = [
        { id: '1', name: 'Main Account', balance: '₦1,458,500.00' },
        { id: '2', name: 'Savings Account', balance: '₦1,000,000.00' },
    ];
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                {/* Top Navbar */}
                <div className="sticky top-0 z-40 border-b border-gray-200 bg-white ">
                    <div className="flex items-center justify-between px-6 py-4 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                                type="button"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>

                            {/* Search Bar */}
                            <div className="hidden w-96 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5  md:flex">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search transactions, accounts..."
                                    className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                                />
                            </div>

                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
                                type="button"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Account Switcher */}
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() =>
                                        setAccountDropdownOpen(
                                            !accountDropdownOpen,
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-md border border-blue-500 bg-blue-50 px-4 py-2.5 text-blue-600 transition-colors hover:bg-blue-100"
                                    type="button"
                                >
                                    <Wallet className="h-4 w-4" />
                                    <span className="hidden text-sm font-semibold lg:inline">
                                        {selectedAccount.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {accountDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setAccountDropdownOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
                                            {accounts.map((account) => (
                                                <button
                                                    key={account.id}
                                                    onClick={() => {
                                                        setSelectedAccount(
                                                            account,
                                                        );
                                                        setAccountDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={cn(
                                                        'w-full border-b border-gray-200 px-5 py-4 text-left transition-colors hover:bg-gray-50',
                                                        selectedAccount.id ===
                                                            account.id &&
                                                            'border-l-4 border-l-blue-600 bg-blue-50',
                                                    )}
                                                    type="button"
                                                >
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {account.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {account.balance}
                                                    </p>
                                                </button>
                                            ))}
                                            <div className="p-2">
                                                <Link
                                                    href="/accounts/add"
                                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Add New Account
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Notifications */}
                            <Link
                                href="/notifications"
                                className="relative rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-pink-500 text-[10px] font-bold text-white">
                                    3
                                </span>
                            </Link>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen,
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-md border border-gray-300 p-1.5 transition-colors hover:bg-gray-50"
                                    type="button"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                                        <span className="text-xs font-semibold text-white">
                                            {userInitials}
                                        </span>
                                    </div>
                                    <ChevronDown className="hidden h-4 w-4 text-gray-600 sm:block" />
                                </button>

                                {profileDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setProfileDropdownOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                                            <div className="rounded-t-lg border-b border-gray-200 bg-blue-50 px-5 py-4">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {userName}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    {auth?.user?.email ||
                                                        'member@example.com'}
                                                </p>
                                            </div>
                                            <Link
                                                href="/settings"
                                                className="flex items-center gap-2 border-b border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                Settings
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
                                            >
                                                Sign out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {searchOpen && (
                        <div className="border-t border-gray-200 px-6 py-3 md:hidden">
                            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 ">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Welcome Header */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 ">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Welcome back, {firstName}! 👋
                        </h1>
                        <p className="text-base text-gray-600">
                            Here's what's happening with your accounts today.
                        </p>
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
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 ">
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
                            <div className="rounded-lg border border-gray-200 bg-white ">
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
                                        {recentTransactions.map(
                                            (transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300 hover:"
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
                                                            {transaction.amount}
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
                                                            {transaction.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Cards */}
                        <div className="space-y-5">
                            {/* Account Summary */}
                            <div className="rounded-lg border border-gray-200 bg-white ">
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
                                            Total Income
                                        </p>
                                        <p className="text-3xl font-bold text-white">
                                            ₦850,000.00
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-100">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            +15% from last month
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-pink-600 p-5 shadow-md">
                                        <p className="mb-2 text-sm font-medium text-pink-100">
                                            Total Expenses
                                        </p>
                                        <p className="text-3xl font-bold text-white">
                                            ₦320,000.00
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-pink-100">
                                            <TrendingDown className="h-3.5 w-3.5" />
                                            -5% from last month
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

                            {/* Premium Upgrade */}
                            <div className="rounded-lg bg-blue-600 p-6 text-white shadow-md">
                                <div className="mb-5 inline-block rounded-md bg-white/20 p-4">
                                    <Package className="h-8 w-8" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    Upgrade to Premium
                                </h3>
                                <p className="mb-5 text-sm text-blue-100">
                                    Get access to exclusive thrift packages and
                                    higher returns
                                </p>
                                <Button
                                    variant="secondary"
                                    className="w-full rounded-md bg-white py-3 font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Dashboard;
