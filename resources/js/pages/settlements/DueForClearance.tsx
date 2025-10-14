import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, DollarSign, User } from 'lucide-react';

type Account = {
    id: string;
    accountName: string;
    accountNumber: string;
    packageType: string;
    maturityDate: string;
    daysOverdue: number;
    principalAmount: string;
    returnAmount: string;
    totalPayout: string;
    status: 'overdue' | 'due-today' | 'due-soon';
};

const accounts: Account[] = [
    {
        id: '1',
        accountName: 'John Doe',
        accountNumber: 'ACC0012345',
        packageType: 'Gold Package',
        maturityDate: '2025-10-01',
        daysOverdue: 12,
        principalAmount: '₦500,000.00',
        returnAmount: '₦60,000.00',
        totalPayout: '₦560,000.00',
        status: 'overdue',
    },
    {
        id: '2',
        accountName: 'Jane Smith',
        accountNumber: 'ACC0012346',
        packageType: 'Platinum Package',
        maturityDate: '2025-10-13',
        daysOverdue: 0,
        principalAmount: '₦1,000,000.00',
        returnAmount: '₦150,000.00',
        totalPayout: '₦1,150,000.00',
        status: 'due-today',
    },
    {
        id: '3',
        accountName: 'Michael Johnson',
        accountNumber: 'ACC0012347',
        packageType: 'Silver Package',
        maturityDate: '2025-10-15',
        daysOverdue: -2,
        principalAmount: '₦250,000.00',
        returnAmount: '₦20,000.00',
        totalPayout: '₦270,000.00',
        status: 'due-soon',
    },
    {
        id: '4',
        accountName: 'Sarah Williams',
        accountNumber: 'ACC0012348',
        packageType: 'Gold Package',
        maturityDate: '2025-09-28',
        daysOverdue: 15,
        principalAmount: '₦750,000.00',
        returnAmount: '₦90,000.00',
        totalPayout: '₦840,000.00',
        status: 'overdue',
    },
];

const DueForClearance = () => {
    const overdueAccounts = accounts.filter((acc) => acc.status === 'overdue');
    const dueTodayAccounts = accounts.filter(
        (acc) => acc.status === 'due-today',
    );
    const dueSoonAccounts = accounts.filter((acc) => acc.status === 'due-soon');

    const totalOverdueAmount = overdueAccounts.reduce(
        (sum, acc) => sum + parseFloat(acc.totalPayout.replace(/[₦,]/g, '')),
        0,
    );

    return (
        <>
            <Head title="Due for Clearance - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Due for Clearance
                        </h1>
                        <p className="text-base text-gray-600">
                            Accounts that are due for settlement clearance
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-red-500 p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <AlertCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-100">
                                        Overdue
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {overdueAccounts.length}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-red-100">
                                ₦{totalOverdueAmount.toLocaleString()}.00 total
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-yellow-500 p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-100">
                                        Due Today
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {dueTodayAccounts.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-blue-500 p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-100">
                                        Due Soon
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {dueSoonAccounts.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-pink-500 p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-pink-100">
                                        Total Due
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {accounts.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accounts List */}
                    <div className="space-y-6">
                        {/* Overdue Accounts */}
                        {overdueAccounts.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="border-b border-gray-200 bg-red-50 p-6">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                        <h2 className="text-xl font-bold text-red-900">
                                            Overdue Accounts
                                        </h2>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {overdueAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="p-6 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex items-start gap-3">
                                                        <div className="rounded-md bg-red-100 p-2">
                                                            <User className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {
                                                                    account.accountName
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    account.accountNumber
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    account.packageType
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Maturity Date
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.maturityDate
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Days Overdue
                                                            </p>
                                                            <p className="mt-1 text-sm font-bold text-red-600">
                                                                {
                                                                    account.daysOverdue
                                                                }{' '}
                                                                days
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Principal
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.principalAmount
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Return
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-green-600">
                                                                +
                                                                {
                                                                    account.returnAmount
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            Total Payout
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {
                                                                account.totalPayout
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                                        type="button"
                                                    >
                                                        Clear Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Due Today */}
                        {dueTodayAccounts.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="border-b border-gray-200 bg-yellow-50 p-6">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                        <h2 className="text-xl font-bold text-yellow-900">
                                            Due Today
                                        </h2>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {dueTodayAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="p-6 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex items-start gap-3">
                                                        <div className="rounded-md bg-yellow-100 p-2">
                                                            <User className="h-5 w-5 text-yellow-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {
                                                                    account.accountName
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    account.accountNumber
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    account.packageType
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Maturity Date
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.maturityDate
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Principal
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.principalAmount
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Return
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-green-600">
                                                                +
                                                                {
                                                                    account.returnAmount
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            Total Payout
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {
                                                                account.totalPayout
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="rounded-md bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                                                        type="button"
                                                    >
                                                        Clear Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Due Soon */}
                        {dueSoonAccounts.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="border-b border-gray-200 bg-blue-50 p-6">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                        <h2 className="text-xl font-bold text-blue-900">
                                            Due Soon (Next 7 Days)
                                        </h2>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {dueSoonAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="p-6 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex items-start gap-3">
                                                        <div className="rounded-md bg-blue-100 p-2">
                                                            <User className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {
                                                                    account.accountName
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    account.accountNumber
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    account.packageType
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Maturity Date
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.maturityDate
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Principal
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {
                                                                    account.principalAmount
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Return
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-green-600">
                                                                +
                                                                {
                                                                    account.returnAmount
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            Total Payout
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {
                                                                account.totalPayout
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="rounded-md border border-blue-600 bg-white px-6 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                                        type="button"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default DueForClearance;
