import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

type Settlement = {
    id: string;
    packageName: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'completed' | 'failed';
    settlementDate?: string;
};

const Settlements = () => {
    const settlements: Settlement[] = [
        {
            id: '1',
            packageName: 'Gold Thrift Package',
            amount: 125000,
            dueDate: 'Oct 15, 2025',
            status: 'pending',
        },
        {
            id: '2',
            packageName: 'Silver Thrift Package',
            amount: 85000,
            dueDate: 'Oct 10, 2025',
            status: 'completed',
            settlementDate: 'Oct 10, 2025',
        },
        {
            id: '3',
            packageName: 'Platinum Thrift Package',
            amount: 200000,
            dueDate: 'Oct 05, 2025',
            status: 'completed',
            settlementDate: 'Oct 05, 2025',
        },
        {
            id: '4',
            packageName: 'Bronze Thrift Package',
            amount: 50000,
            dueDate: 'Sep 28, 2025',
            status: 'failed',
        },
    ];

    const pendingSettlements = settlements.filter(
        (s) => s.status === 'pending',
    );
    const completedSettlements = settlements.filter(
        (s) => s.status === 'completed',
    );

    const totalPending = pendingSettlements.reduce(
        (sum, s) => sum + s.amount,
        0,
    );
    const totalCompleted = completedSettlements.reduce(
        (sum, s) => sum + s.amount,
        0,
    );

    return (
        <>
            <Head title="Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Settlements
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Track your pending and completed package settlements
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Pending Settlements
                                </p>
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">
                                ₦{totalPending.toLocaleString('en-NG')}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {pendingSettlements.length} settlement(s)
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Completed Settlements
                                </p>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                ₦{totalCompleted.toLocaleString('en-NG')}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {completedSettlements.length} settlement(s)
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Total Settlements
                                </p>
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {settlements.length}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                All time
                            </p>
                        </div>
                    </div>

                    {/* Pending Settlements */}
                    {pendingSettlements.length > 0 && (
                        <div className="mb-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Pending Settlements
                            </h2>
                            <div className="space-y-4">
                                {pendingSettlements.map((settlement) => (
                                    <div
                                        key={settlement.id}
                                        className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                                    {settlement.packageName}
                                                </h3>
                                                <p className="mb-2 text-2xl font-bold text-yellow-600">
                                                    ₦
                                                    {settlement.amount.toLocaleString(
                                                        'en-NG',
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Due date:{' '}
                                                    {settlement.dueDate}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                                                <Clock className="h-4 w-4" />
                                                Pending
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Settlements */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                All Settlements
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {settlements.map((settlement) => (
                                <div
                                    key={settlement.id}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                'rounded-full p-3',
                                                settlement.status ===
                                                    'completed' &&
                                                    'bg-green-100 text-green-600',
                                                settlement.status ===
                                                    'pending' &&
                                                    'bg-yellow-100 text-yellow-600',
                                                settlement.status ===
                                                    'failed' &&
                                                    'bg-red-100 text-red-600',
                                            )}
                                        >
                                            {settlement.status ===
                                                'completed' && (
                                                <CheckCircle className="h-6 w-6" />
                                            )}
                                            {settlement.status ===
                                                'pending' && (
                                                <Clock className="h-6 w-6" />
                                            )}
                                            {settlement.status === 'failed' && (
                                                <XCircle className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {settlement.packageName}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {settlement.status ===
                                                'completed'
                                                    ? `Settled on ${settlement.settlementDate}`
                                                    : `Due on ${settlement.dueDate}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            ₦
                                            {settlement.amount.toLocaleString(
                                                'en-NG',
                                            )}
                                        </p>
                                        <span
                                            className={cn(
                                                'inline-block rounded-full px-3 py-1 text-xs font-medium',
                                                settlement.status ===
                                                    'completed' &&
                                                    'bg-green-100 text-green-700',
                                                settlement.status ===
                                                    'pending' &&
                                                    'bg-yellow-100 text-yellow-700',
                                                settlement.status ===
                                                    'failed' &&
                                                    'bg-red-100 text-red-700',
                                            )}
                                        >
                                            {settlement.status}
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

export default Settlements;
