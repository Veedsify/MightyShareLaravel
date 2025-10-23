import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Filter,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type TransactionStatus = 'successful' | 'pending' | 'failed' | string;
type TransactionType = 'credit' | 'debit' | string;

type Transaction = {
    id: number | string;
    reference: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    paymentMethod?: string | null;
    description?: string | null;
    createdAt: string | null;
    accountNumber?: string | null;
};

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
    const transactionsData = useMemo(() => transactions || [], [transactions]);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>(
        'all',
    );
    const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>(
        'all',
    );

    const filteredTransactions = useMemo(() => {
        return transactionsData.filter((transaction) => {
            const matchesSearch =
                transaction.reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (transaction.description ?? '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || transaction.status === statusFilter;

            const matchesType =
                typeFilter === 'all' || transaction.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [transactionsData, searchTerm, statusFilter, typeFilter]);

    const totalCredits = useMemo(
        () =>
            transactions
                .filter(
                    (transaction) =>
                        transaction.type === 'credit' &&
                        transaction.status === 'successful',
                )
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [transactions],
    );

    const totalDebits = useMemo(
        () =>
            transactions
                .filter(
                    (transaction) =>
                        transaction.type === 'debit' &&
                        transaction.status === 'successful',
                )
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [transactions],
    );

    const handleExport = () => {
        window.alert('Export functionality coming soon!');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case 'successful':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: TransactionType) => {
        return type === 'debit' ? 'text-red-600' : 'text-green-600';
    };

    return (
        <>
            <Head title="Transactions" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Transactions
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Explore your recent credits and debits, filter
                                by status, and keep track of your account
                                activity.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Total Credits
                                </p>
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-green-600">
                                ₦{totalCredits.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Total Debits
                                </p>
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-red-600">
                                ₦{totalDebits.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-600">
                                Total Transactions
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <label
                                    className="sr-only"
                                    htmlFor="transaction-search"
                                >
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="transaction-search"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                        placeholder="Search by reference or description..."
                                        className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-3 pl-10 text-sm transition outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Filters
                                </label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target
                                                    .value as typeof statusFilter,
                                            )
                                        }
                                        className="flex-1 rounded-md border border-gray-300 px-2 py-2 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="successful">
                                            Successful
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                    <select
                                        value={typeFilter}
                                        onChange={(event) =>
                                            setTypeFilter(
                                                event.target
                                                    .value as typeof typeFilter,
                                            )
                                        }
                                        className="flex-1 rounded-md border border-gray-300 px-2 py-2 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">Credits</option>
                                        <option value="debit">Debits</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {filteredTransactions.length === 0 ? (
                                <div className="px-6 py-16 text-center text-gray-500">
                                    {transactions.length === 0
                                        ? 'No transactions found.'
                                        : 'No transactions match your filters.'}
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Reference
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Payment Method
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-600">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map(
                                            (transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="border-t border-gray-100 transition hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-3 font-mono text-xs text-gray-800">
                                                        {transaction.reference}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-600">
                                                        {transaction.description ||
                                                            'N/A'}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-3 font-medium ${getTypeColor(transaction.type)}`}
                                                    >
                                                        {transaction.type ===
                                                        'debit'
                                                            ? 'Debit'
                                                            : 'Credit'}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-600">
                                                        {transaction.paymentMethod ||
                                                            'N/A'}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}
                                                        >
                                                            {transaction.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                transaction.status.slice(
                                                                    1,
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className={`px-6 py-3 text-right font-semibold ${getTypeColor(transaction.type)}`}
                                                    >
                                                        ₦
                                                        {transaction.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-600">
                                                        {formatDate(
                                                            transaction.createdAt,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Transactions;
