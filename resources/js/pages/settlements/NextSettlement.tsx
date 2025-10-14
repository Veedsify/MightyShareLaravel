import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
} from 'lucide-react';

type UpcomingSettlement = {
    id: string;
    batchNumber: string;
    scheduledDate: string;
    daysUntil: number;
    totalAccounts: number;
    totalAmount: string;
    status: 'scheduled' | 'preparing';
};

const nextSettlement: UpcomingSettlement = {
    id: '1',
    batchNumber: 'BATCH-2025-11-001',
    scheduledDate: 'November 15, 2025',
    daysUntil: 33,
    totalAccounts: 45,
    totalAmount: '₦12,500,000.00',
    status: 'scheduled',
};

const upcomingBatches: UpcomingSettlement[] = [
    {
        id: '2',
        batchNumber: 'BATCH-2025-12-001',
        scheduledDate: 'December 15, 2025',
        daysUntil: 63,
        totalAccounts: 38,
        totalAmount: '₦9,800,000.00',
        status: 'preparing',
    },
    {
        id: '3',
        batchNumber: 'BATCH-2026-01-001',
        scheduledDate: 'January 15, 2026',
        daysUntil: 94,
        totalAccounts: 52,
        totalAmount: '₦15,200,000.00',
        status: 'preparing',
    },
];

const NextSettlement = () => {
    return (
        <>
            <Head title="Next Settlement - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Next Settlement
                        </h1>
                        <p className="text-base text-gray-600">
                            View upcoming settlement schedules and batch details
                        </p>
                    </div>

                    {/* Countdown Banner */}
                    <div className="mb-6 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-md bg-white/20 p-3">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Next Settlement Date
                                </h2>
                                <p className="text-blue-100">
                                    {nextSettlement.batchNumber}
                                </p>
                            </div>
                        </div>

                        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-100" />
                                    <p className="text-sm font-medium text-blue-100">
                                        Days Remaining
                                    </p>
                                </div>
                                <p className="text-4xl font-bold">
                                    {nextSettlement.daysUntil}
                                </p>
                            </div>

                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-100" />
                                    <p className="text-sm font-medium text-blue-100">
                                        Total Accounts
                                    </p>
                                </div>
                                <p className="text-4xl font-bold">
                                    {nextSettlement.totalAccounts}
                                </p>
                            </div>

                            <div className="rounded-lg bg-white/10 p-5 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-blue-100" />
                                    <p className="text-sm font-medium text-blue-100">
                                        Total Amount
                                    </p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {nextSettlement.totalAmount}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-blue-100">
                                <strong>Scheduled for:</strong>{' '}
                                {nextSettlement.scheduledDate}
                            </p>
                        </div>
                    </div>

                    {/* Settlement Details */}
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-green-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Average Return
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        12.5%
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600">
                                Expected return rate for this settlement batch
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-blue-100 p-3">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Settlement Window
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        3 Days
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600">
                                Processing time for all payments
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-pink-100 p-3">
                                    <DollarSign className="h-6 w-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Transaction Fees
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0.5%
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600">
                                Applied to all settlements
                            </p>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <h3 className="text-lg font-bold text-yellow-900">
                                Important Information
                            </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-yellow-800">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-yellow-600">•</span>
                                <span>
                                    All accounts included in the next settlement
                                    have reached their maturity date
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-yellow-600">•</span>
                                <span>
                                    Settlement payments will be processed in the
                                    order accounts were registered
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-yellow-600">•</span>
                                <span>
                                    You will receive email and SMS notifications
                                    7 days before the settlement date
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-yellow-600">•</span>
                                <span>
                                    Ensure your payment details are up to date
                                    to avoid delays
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Upcoming Settlement Batches */}
                    <div className="rounded-lg border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Upcoming Settlement Batches
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Future scheduled settlement dates
                            </p>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {upcomingBatches.map((batch) => (
                                <div
                                    key={batch.id}
                                    className="p-6 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="mb-3 flex items-center gap-3">
                                                <div className="rounded-md bg-blue-100 p-3">
                                                    <Calendar className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {batch.batchNumber}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Scheduled for{' '}
                                                        {batch.scheduledDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Days Until
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {batch.daysUntil} days
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Accounts
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {batch.totalAccounts}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Total Amount
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {batch.totalAmount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-medium text-blue-700">
                                            {batch.status === 'scheduled'
                                                ? 'Scheduled'
                                                : 'Preparing'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default NextSettlement;
