import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Download,
    Filter,
    Search,
} from 'lucide-react';
import { useState } from 'react';

type Transaction = {
    id: string;
    type: 'credit' | 'debit';
    category: string;
    description: string;
    amount: number;
    date: string;
    time: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
};

const Transactions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');

    const transactions: Transaction[] = [
        {
            id: '1',
            type: 'credit',
            category: 'Deposit',
            description: 'Deposit from Access Bank',
            amount: 50000.0,
            date: 'Oct 13, 2025',
            time: '14:30',
            status: 'completed',
            reference: 'TRX001234567',
        },
        {
            id: '2',
            type: 'debit',
            category: 'Withdrawal',
            description: 'Withdrawal to GTBank',
            amount: 25000.0,
            date: 'Oct 13, 2025',
            time: '10:15',
            status: 'pending',
            reference: 'TRX001234568',
        },
        {
            id: '3',
            type: 'credit',
            category: 'Thrift Return',
            description: 'Monthly thrift package return',
            amount: 100000.0,
            date: 'Oct 12, 2025',
            time: '09:00',
            status: 'completed',
            reference: 'TRX001234569',
        },
        {
            id: '4',
            type: 'debit',
            category: 'Subscription',
            description: 'Gold package subscription',
            amount: 15000.0,
            date: 'Oct 11, 2025',
            time: '16:45',
            status: 'completed',
            reference: 'TRX001234570',
        },
        {
            id: '5',
            type: 'credit',
            category: 'Deposit',
            description: 'Deposit from Zenith Bank',
            amount: 75000.0,
            date: 'Oct 10, 2025',
            time: '11:20',
            status: 'completed',
            reference: 'TRX001234571',
        },
        {
            id: '6',
            type: 'debit',
            category: 'Transfer',
            description: 'Transfer to John Doe',
            amount: 20000.0,
            date: 'Oct 10, 2025',
            time: '08:30',
            status: 'failed',
            reference: 'TRX001234572',
        },
        {
            id: '7',
            type: 'credit',
            category: 'Refund',
            description: 'Refund for failed transaction',
            amount: 20000.0,
            date: 'Oct 09, 2025',
            time: '15:00',
            status: 'completed',
            reference: 'TRX001234573',
        },
        {
            id: '8',
            type: 'debit',
            category: 'Withdrawal',
            description: 'ATM withdrawal',
            amount: 10000.0,
            date: 'Oct 08, 2025',
            time: '12:00',
            status: 'completed',
            reference: 'TRX001234574',
        },
    ];

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            transaction.reference
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === 'all' || transaction.status === filterStatus;
        const matchesType =
            filterType === 'all' || transaction.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const totalCredit = transactions
        .filter((t) => t.type === 'credit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
        .filter((t) => t.type === 'debit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <>
            <Head title="Transactions" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Transactions
                        </h1>
                        <p className="mt-2 text-gray-600">
                            View and manage all your transaction history
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm text-gray-600">
                                Total Credits
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                ₦{totalCredit.toLocaleString('en-NG')}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm text-gray-600">
                                Total Debits
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                                ₦{totalDebit.toLocaleString('en-NG')}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm text-gray-600">
                                Total Transactions
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by description or reference..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <div className="relative">
                                    <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-md border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <div className="relative">
                                    <Calendar className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={filterType}
                                        onChange={(e) =>
                                            setFilterType(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-md border border-gray-300 py-2.5 pr-4 pl-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Description
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Reference
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div
                                                    className={cn(
                                                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
                                                        transaction.type ===
                                                            'credit'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700',
                                                    )}
                                                >
                                                    {transaction.type ===
                                                    'credit' ? (
                                                        <ArrowDownLeft className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    )}
                                                    {transaction.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {transaction.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p
                                                    className={cn(
                                                        'font-semibold',
                                                        transaction.type ===
                                                            'credit'
                                                            ? 'text-green-600'
                                                            : 'text-red-600',
                                                    )}
                                                >
                                                    {transaction.type ===
                                                    'credit'
                                                        ? '+'
                                                        : '-'}
                                                    ₦
                                                    {transaction.amount.toLocaleString(
                                                        'en-NG',
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900">
                                                    {transaction.date}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {transaction.time}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        'inline-block rounded-full px-3 py-1 text-xs font-medium',
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
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-mono text-sm text-gray-600">
                                                    {transaction.reference}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTransactions.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-600">
                                    No transactions found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Transactions;
