import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Package,
    TrendingUp,
} from 'lucide-react';

type Subscription = {
    id: string;
    packageName: string;
    packageTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    startDate: string;
    maturityDate: string;
    monthlyContribution: string;
    totalContributed: string;
    expectedReturn: string;
    totalPayout: string;
    status: 'active' | 'completed' | 'pending';
    daysRemaining: number;
    progress: number;
};

const subscriptions: Subscription[] = [
    {
        id: '1',
        packageName: 'Gold Thrift Package',
        packageTier: 'Gold',
        startDate: '2025-04-13',
        maturityDate: '2025-10-13',
        monthlyContribution: '₦100,000.00',
        totalContributed: '₦600,000.00',
        expectedReturn: '₦72,000.00',
        totalPayout: '₦672,000.00',
        status: 'active',
        daysRemaining: 0,
        progress: 100,
    },
    {
        id: '2',
        packageName: 'Platinum Thrift Package',
        packageTier: 'Platinum',
        startDate: '2025-06-01',
        maturityDate: '2026-06-01',
        monthlyContribution: '₦200,000.00',
        totalContributed: '₦1,000,000.00',
        expectedReturn: '₦180,000.00',
        totalPayout: '₦1,180,000.00',
        status: 'active',
        daysRemaining: 231,
        progress: 42,
    },
    {
        id: '3',
        packageName: 'Silver Thrift Package',
        packageTier: 'Silver',
        startDate: '2024-12-01',
        maturityDate: '2025-06-01',
        monthlyContribution: '₦50,000.00',
        totalContributed: '₦300,000.00',
        expectedReturn: '₦24,000.00',
        totalPayout: '₦324,000.00',
        status: 'completed',
        daysRemaining: 0,
        progress: 100,
    },
];

const MySubscriptions = () => {
    const activeSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'active',
    );
    const completedSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'completed',
    );

    const totalInvested = subscriptions.reduce(
        (sum, sub) =>
            sum + parseFloat(sub.totalContributed.replace(/[₦,]/g, '')),
        0,
    );

    const totalExpectedReturns = subscriptions.reduce(
        (sum, sub) => sum + parseFloat(sub.expectedReturn.replace(/[₦,]/g, '')),
        0,
    );

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Bronze':
                return 'bg-orange-500';
            case 'Silver':
                return 'bg-gray-400';
            case 'Gold':
                return 'bg-yellow-500';
            case 'Platinum':
                return 'bg-purple-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <>
            <Head title="My Subscriptions - Thrift Packages" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                My Subscriptions
                            </h1>
                            <p className="text-base text-gray-600">
                                Manage and track your active thrift package
                                subscriptions
                            </p>
                        </div>
                        <Link
                            href="/dashboard/packages"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Package className="h-4 w-4" />
                            Browse Packages
                        </Link>
                    </div>

                    {/* Summary Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-blue-600 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-100">
                                        Active Subscriptions
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {activeSubscriptions.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-green-500 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-100">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {completedSubscriptions.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-pink-500 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-pink-100">
                                        Total Invested
                                    </p>
                                    <p className="text-xl font-bold text-white">
                                        ₦{totalInvested.toLocaleString()}.00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-purple-500 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-purple-100">
                                        Expected Returns
                                    </p>
                                    <p className="text-xl font-bold text-white">
                                        ₦{totalExpectedReturns.toLocaleString()}
                                        .00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Subscriptions */}
                    {activeSubscriptions.length > 0 && (
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Active Subscriptions
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Your currently running thrift packages
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {activeSubscriptions.map((subscription) => (
                                    <div
                                        key={subscription.id}
                                        className="p-6 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`rounded-lg p-4 ${getTierColor(subscription.packageTier)} shadow-md`}
                                                >
                                                    <Package className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {
                                                            subscription.packageName
                                                        }
                                                    </h3>
                                                    <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                        {
                                                            subscription.packageTier
                                                        }{' '}
                                                        Tier
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">
                                                    Total Payout
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {subscription.totalPayout}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700">
                                                    Progress
                                                </span>
                                                <span className="font-semibold text-blue-600">
                                                    {subscription.progress}%
                                                </span>
                                            </div>
                                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${subscription.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                                            <div>
                                                <div className="mb-1 flex items-center gap-1 text-gray-500">
                                                    <Calendar className="h-3 w-3" />
                                                    <p className="text-xs">
                                                        Start Date
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {subscription.startDate}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="mb-1 flex items-center gap-1 text-gray-500">
                                                    <Calendar className="h-3 w-3" />
                                                    <p className="text-xs">
                                                        Maturity Date
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {subscription.maturityDate}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="mb-1 flex items-center gap-1 text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    <p className="text-xs">
                                                        Days Remaining
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-600">
                                                    {subscription.daysRemaining}{' '}
                                                    days
                                                </p>
                                            </div>
                                            <div>
                                                <div className="mb-1 flex items-center gap-1 text-gray-500">
                                                    <DollarSign className="h-3 w-3" />
                                                    <p className="text-xs">
                                                        Contributed
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        subscription.totalContributed
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <div className="mb-1 flex items-center gap-1 text-gray-500">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <p className="text-xs">
                                                        Expected Return
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-green-600">
                                                    +
                                                    {
                                                        subscription.expectedReturn
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Subscriptions */}
                    {completedSubscriptions.length > 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white">
                            <div className="border-b border-gray-200 bg-green-50 p-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <h2 className="text-xl font-bold text-green-900">
                                        Completed Subscriptions
                                    </h2>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {completedSubscriptions.map((subscription) => (
                                    <div
                                        key={subscription.id}
                                        className="p-6 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`rounded-lg p-4 ${getTierColor(subscription.packageTier)} shadow-md`}
                                                >
                                                    <Package className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {
                                                            subscription.packageName
                                                        }
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {subscription.startDate}{' '}
                                                        -{' '}
                                                        {
                                                            subscription.maturityDate
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Total Paid Out
                                                    </p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {
                                                            subscription.totalPayout
                                                        }
                                                    </p>
                                                </div>
                                                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Completed
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {subscriptions.length === 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">
                                No Subscriptions Yet
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Start your thrift savings journey by subscribing
                                to a package
                            </p>
                            <Link
                                href="/dashboard/packages"
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <Package className="h-4 w-4" />
                                Browse Packages
                            </Link>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default MySubscriptions;
