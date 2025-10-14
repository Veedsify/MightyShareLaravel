import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Download,
    Filter,
    Search,
    User,
} from 'lucide-react';
import { useState } from 'react';

type PaidAccount = {
    id: string;
    accountName: string;
    accountNumber: string;
    packageType: string;
    startDate: string;
    maturityDate: string;
    clearanceDate: string;
    principalAmount: string;
    returnAmount: string;
    totalPaidOut: string;
    paymentMethod: string;
};

const paidAccounts: PaidAccount[] = [
    {
        id: '1',
        accountName: 'Alice Johnson',
        accountNumber: 'ACC0012340',
        packageType: 'Platinum Package',
        startDate: '2025-04-13',
        maturityDate: '2025-10-13',
        clearanceDate: '2025-10-13',
        principalAmount: '₦2,000,000.00',
        returnAmount: '₦300,000.00',
        totalPaidOut: '₦2,300,000.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: '2',
        accountName: 'David Brown',
        accountNumber: 'ACC0012341',
        packageType: 'Gold Package',
        startDate: '2025-03-10',
        maturityDate: '2025-09-10',
        clearanceDate: '2025-09-12',
        principalAmount: '₦500,000.00',
        returnAmount: '₦60,000.00',
        totalPaidOut: '₦560,000.00',
        paymentMethod: 'Mobile Money',
    },
    {
        id: '3',
        accountName: 'Emma Wilson',
        accountNumber: 'ACC0012342',
        packageType: 'Silver Package',
        startDate: '2025-02-15',
        maturityDate: '2025-08-15',
        clearanceDate: '2025-08-15',
        principalAmount: '₦150,000.00',
        returnAmount: '₦12,000.00',
        totalPaidOut: '₦162,000.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: '4',
        accountName: 'Frank Taylor',
        accountNumber: 'ACC0012343',
        packageType: 'Gold Package',
        startDate: '2025-01-20',
        maturityDate: '2025-07-20',
        clearanceDate: '2025-07-21',
        principalAmount: '₦750,000.00',
        returnAmount: '₦90,000.00',
        totalPaidOut: '₦840,000.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: '5',
        accountName: 'Grace Anderson',
        accountNumber: 'ACC0012344',
        packageType: 'Bronze Package',
        startDate: '2025-04-01',
        maturityDate: '2025-07-01',
        clearanceDate: '2025-07-02',
        principalAmount: '₦50,000.00',
        returnAmount: '₦2,500.00',
        totalPaidOut: '₦52,500.00',
        paymentMethod: 'Mobile Money',
    },
];

const AllPaidAccounts = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPackage, setFilterPackage] = useState('all');

    const filteredAccounts = paidAccounts.filter((account) => {
        const matchesSearch =
            account.accountName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            account.accountNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterPackage === 'all' || account.packageType === filterPackage;
        return matchesSearch && matchesFilter;
    });

    const totalPaidOut = paidAccounts.reduce(
        (sum, acc) => sum + parseFloat(acc.totalPaidOut.replace(/[₦,]/g, '')),
        0,
    );

    return (
        <>
            <Head title="All Paid Accounts - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            All Paid Accounts
                        </h1>
                        <p className="text-base text-gray-600">
                            Complete history of all settled and paid-out
                            accounts
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-green-500 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-100">
                                        Total Paid
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {paidAccounts.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-blue-600 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-100">
                                        Total Amount Paid
                                    </p>
                                    <p className="text-xl font-bold text-white">
                                        ₦{totalPaidOut.toLocaleString()}.00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-pink-500 p-6 shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-md bg-white/20 p-3">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-pink-100">
                                        This Month
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        2
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name or account number..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        value={filterPackage}
                                        onChange={(e) =>
                                            setFilterPackage(e.target.value)
                                        }
                                        className="border-none bg-transparent text-sm text-gray-700 outline-none"
                                    >
                                        <option value="all">
                                            All Packages
                                        </option>
                                        <option value="Bronze Package">
                                            Bronze Package
                                        </option>
                                        <option value="Silver Package">
                                            Silver Package
                                        </option>
                                        <option value="Gold Package">
                                            Gold Package
                                        </option>
                                        <option value="Platinum Package">
                                            Platinum Package
                                        </option>
                                    </select>
                                </div>

                                <button
                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    type="button"
                                >
                                    <Download className="h-4 w-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accounts Table */}
                    <div className="rounded-lg border border-gray-200 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Account Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Package
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Dates
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Amounts
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Payment Method
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAccounts.map((account) => (
                                        <tr
                                            key={account.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-md bg-green-100 p-2">
                                                        <User className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                account.accountName
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {
                                                                account.accountNumber
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                    {account.packageType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-500">
                                                        Start:{' '}
                                                        {account.startDate}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Maturity:{' '}
                                                        {account.maturityDate}
                                                    </p>
                                                    <p className="text-xs font-medium text-green-600">
                                                        Cleared:{' '}
                                                        {account.clearanceDate}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900">
                                                        {
                                                            account.principalAmount
                                                        }
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        +{account.returnAmount}
                                                    </p>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {account.totalPaidOut}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">
                                                    {account.paymentMethod}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredAccounts.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">
                                    No accounts found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default AllPaidAccounts;
