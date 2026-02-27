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

type TransactionStatus = 'completed' | 'pending' | 'failed' | 'successful' | string;
type TransactionDirection = 'credit' | 'debit';
type TransactionType =
    | 'topup'
    | 'registration_fee'
    | 'pending_registration_fee'
    | 'pending_deduction'
    | 'payment'
    | string;

type Transaction = {
    id: number | string;
    reference: string;
    amount: number;
    type: TransactionType;
    direction: TransactionDirection;
    status: TransactionStatus;
    paymentMethod?: string | null;
    description?: string | null;
    createdAt: string | null;
    accountNumber?: string | null;
};

type DistributionPayment = {
    id: number;
    accountNumber: string | null;
    accountId: number;
    month: string;
    amount: number;
    status: string;
    reference: string | null;
    createdAt: string | null;
};

type DistributionSummary = {
    month: string;
    accountsCount: number;
    totalAmount: number;
};

type Props = {
    transactions: Transaction[];
    distributionPayments: DistributionPayment[];
    distributionSummary: DistributionSummary[];
};

const Transactions = ({ transactions, distributionPayments, distributionSummary }: Props) => {
    const transactionsData = useMemo(() => transactions || [], [transactions]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
    const [directionFilter, setDirectionFilter] = useState<'all' | TransactionDirection>('all');
    const [activeTab, setActiveTab] = useState<'transactions' | 'distributions'>('transactions');

    const filteredTransactions = useMemo(() => {
        return transactionsData.filter((t) => {
            const matchesSearch =
                t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            const matchesType = typeFilter === 'all' || t.type === typeFilter;
            const matchesDirection = directionFilter === 'all' || t.direction === directionFilter;
            return matchesSearch && matchesStatus && matchesType && matchesDirection;
        });
    }, [transactionsData, searchTerm, statusFilter, typeFilter, directionFilter]);

    // Informational types excluded from totals
    const informationalTypes = ['pending_registration_fee'];

    const totalCredits = useMemo(
        () =>
            transactions
                .filter(
                    (t) =>
                        t.direction === 'credit' &&
                        (t.status === 'successful' || t.status === 'completed') &&
                        !informationalTypes.includes(t.type),
                )
                .reduce((sum, t) => sum + t.amount, 0),
        [transactions],
    );

    const totalDebits = useMemo(
        () =>
            transactions
                .filter(
                    (t) =>
                        t.direction === 'debit' &&
                        (t.status === 'successful' || t.status === 'completed') &&
                        !informationalTypes.includes(t.type),
                )
                .reduce((sum, t) => sum + t.amount, 0),
        [transactions],
    );

    const totalDistributed = useMemo(
        () => (distributionPayments || []).filter((d) => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
        [distributionPayments],
    );

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

    const formatMonth = (month: string) => {
        const [year, m] = month.split('-');
        const date = new Date(parseInt(year), parseInt(m) - 1);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case 'successful':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDirectionColor = (direction: TransactionDirection) => {
        return direction === 'debit' ? 'text-red-600' : 'text-green-600';
    };

    const getTypeLabel = (type: TransactionType) => {
        const labels: Record<string, string> = {
            topup: 'Top Up',
            registration_fee: 'Registration Fee',
            pending_registration_fee: 'Pending Reg. Fee',
            pending_deduction: 'Pending Deduction',
            payment: 'Payment',
        };
        return labels[type] || type;
    };

    return (
        <>
            <Head title="Transactions" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Track your account activity, registration fees, and monthly distributions.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.alert('Export functionality coming soon!')}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Total Credits</p>
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-green-600">
                                ₦{totalCredits.toLocaleString()}
                            </p>
                        </div>
                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Total Debits</p>
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-red-600">
                                ₦{totalDebits.toLocaleString()}
                            </p>
                        </div>
                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-600">Total Distributed</p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                ₦{totalDistributed.toLocaleString()}
                            </p>
                        </div>
                        <div className="border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {transactions.length + (distributionPayments || []).length}
                            </p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="mb-6 flex gap-1 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab('transactions')}
                            className={`px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'transactions'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Account Transactions ({transactions.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('distributions')}
                            className={`px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'distributions'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Monthly Distributions ({(distributionPayments || []).length})
                        </button>
                    </div>

                    {activeTab === 'transactions' && (
                        <>
                            {/* Filters */}
                            <div className="mb-6 border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search by reference or description..."
                                                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-3 pl-10 text-sm transition outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Filters</label>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Filter className="h-4 w-4 text-gray-500" />
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                                className="flex-1 rounded-md border border-gray-300 px-2 py-2 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="completed">Completed</option>
                                                <option value="successful">Successful</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                            <select
                                                value={directionFilter}
                                                onChange={(e) => setDirectionFilter(e.target.value as typeof directionFilter)}
                                                className="flex-1 rounded-md border border-gray-300 px-2 py-2 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="all">All Directions</option>
                                                <option value="credit">Credits</option>
                                                <option value="debit">Debits</option>
                                            </select>
                                            <select
                                                value={typeFilter}
                                                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                                                className="flex-1 rounded-md border border-gray-300 px-2 py-2 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="all">All Types</option>
                                                <option value="topup">Top Up</option>
                                                <option value="registration_fee">Registration Fee</option>
                                                <option value="pending_deduction">Pending Deduction</option>
                                                <option value="payment">Payment</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions Table */}
                            <div className="border border-gray-200 bg-white shadow-sm">
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
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Reference</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Description</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Type</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Direction</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                                                    <th className="px-6 py-3 text-right font-semibold text-gray-600">Amount</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTransactions.map((t) => (
                                                    <tr key={t.id} className="border-t border-gray-100 transition hover:bg-gray-50">
                                                        <td className="px-6 py-3 font-mono text-xs text-gray-800">{t.reference}</td>
                                                        <td className="px-6 py-3 text-gray-600">{t.description || 'N/A'}</td>
                                                        <td className="px-6 py-3">
                                                            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                                {getTypeLabel(t.type)}
                                                            </span>
                                                        </td>
                                                        <td className={`px-6 py-3 font-medium ${getDirectionColor(t.direction)}`}>
                                                            {t.direction === 'debit' ? 'Debit' : 'Credit'}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(t.status)}`}>
                                                                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className={`px-6 py-3 text-right font-semibold ${getDirectionColor(t.direction)}`}>
                                                            ₦{t.amount.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{formatDate(t.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'distributions' && (
                        <>
                            {/* Distribution Summary */}
                            {(distributionSummary || []).length > 0 && (
                                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {(distributionSummary || []).map((s) => (
                                        <div key={s.month} className="border border-blue-200 bg-blue-50 p-4 shadow-sm">
                                            <p className="text-sm font-medium text-blue-900">{formatMonth(s.month)}</p>
                                            <p className="mt-1 text-xl font-bold text-blue-700">₦{s.totalAmount.toLocaleString()}</p>
                                            <p className="text-sm text-blue-600">{s.accountsCount} account{s.accountsCount !== 1 ? 's' : ''} funded</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Distribution Payments Table */}
                            <div className="border border-gray-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    {(distributionPayments || []).length === 0 ? (
                                        <div className="px-6 py-16 text-center text-gray-500">
                                            No distributions yet. Distributions happen monthly based on your package tier.
                                        </div>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Reference</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Account</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Month</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                                                    <th className="px-6 py-3 text-right font-semibold text-gray-600">Amount</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(distributionPayments || []).map((d) => (
                                                    <tr key={d.id} className="border-t border-gray-100 transition hover:bg-gray-50">
                                                        <td className="px-6 py-3 font-mono text-xs text-gray-800">{d.reference || '—'}</td>
                                                        <td className="px-6 py-3 text-gray-800 font-medium">{d.accountNumber || `Account #${d.accountId}`}</td>
                                                        <td className="px-6 py-3 text-gray-600">{formatMonth(d.month)}</td>
                                                        <td className="px-6 py-3">
                                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(d.status)}`}>
                                                                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-semibold text-green-600">
                                                            ₦{d.amount.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{formatDate(d.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default Transactions;
