import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckSquare,
    DollarSign,
    FileText,
    User,
} from 'lucide-react';
import { useState } from 'react';

type SelectedAccount = {
    id: string;
    accountName: string;
    accountNumber: string;
    amount: string;
};

const availableAccounts = [
    {
        id: '1',
        accountName: 'John Doe',
        accountNumber: 'ACC0012345',
        amount: '₦560,000.00',
    },
    {
        id: '2',
        accountName: 'Jane Smith',
        accountNumber: 'ACC0012346',
        amount: '₦1,150,000.00',
    },
    {
        id: '3',
        accountName: 'Michael Johnson',
        accountNumber: 'ACC0012347',
        amount: '₦270,000.00',
    },
    {
        id: '4',
        accountName: 'Sarah Williams',
        accountNumber: 'ACC0012348',
        amount: '₦840,000.00',
    },
    {
        id: '5',
        accountName: 'David Lee',
        accountNumber: 'ACC0012349',
        amount: '₦450,000.00',
    },
];

const RequestBulkWithdrawal = () => {
    const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccount[]>(
        [],
    );
    const [withdrawalMethod, setWithdrawalMethod] = useState('bank-transfer');
    const [requestReason, setRequestReason] = useState('');

    const toggleAccount = (account: (typeof availableAccounts)[0]) => {
        const isSelected = selectedAccounts.some(
            (acc) => acc.id === account.id,
        );
        if (isSelected) {
            setSelectedAccounts(
                selectedAccounts.filter((acc) => acc.id !== account.id),
            );
        } else {
            setSelectedAccounts([...selectedAccounts, account]);
        }
    };

    const totalAmount = selectedAccounts.reduce(
        (sum, acc) => sum + parseFloat(acc.amount.replace(/[₦,]/g, '')),
        0,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle bulk withdrawal request
        alert(
            `Request submitted for ${selectedAccounts.length} accounts totaling ₦${totalAmount.toLocaleString()}.00`,
        );
    };

    return (
        <>
            <Head title="Request Bulk Withdrawal - Settlements" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Request Bulk Withdrawal
                        </h1>
                        <p className="text-base text-gray-600">
                            Submit a request to withdraw multiple settled
                            accounts at once
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Available Accounts */}
                                <div className="rounded-lg border border-gray-200 bg-white">
                                    <div className="border-b border-gray-200 p-6">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Select Accounts
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Choose which settled accounts to
                                            include in this bulk withdrawal
                                        </p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {availableAccounts.map(
                                                (account) => {
                                                    const isSelected =
                                                        selectedAccounts.some(
                                                            (acc) =>
                                                                acc.id ===
                                                                account.id,
                                                        );
                                                    return (
                                                        <button
                                                            key={account.id}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleAccount(
                                                                    account,
                                                                )
                                                            }
                                                            className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all ${
                                                                isSelected
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`flex h-5 w-5 items-center justify-center rounded ${
                                                                        isSelected
                                                                            ? 'bg-blue-600'
                                                                            : 'border-2 border-gray-300 bg-white'
                                                                    }`}
                                                                >
                                                                    {isSelected && (
                                                                        <CheckSquare className="h-4 w-4 text-white" />
                                                                    )}
                                                                </div>
                                                                <div className="rounded-md bg-blue-100 p-2">
                                                                    <User className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div className="text-left">
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
                                                            <p className="text-lg font-bold text-gray-900">
                                                                {account.amount}
                                                            </p>
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Withdrawal Details */}
                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <h2 className="mb-5 text-xl font-bold text-gray-900">
                                        Withdrawal Details
                                    </h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label
                                                htmlFor="withdrawal-method"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Withdrawal Method
                                            </label>
                                            <select
                                                id="withdrawal-method"
                                                value={withdrawalMethod}
                                                onChange={(e) =>
                                                    setWithdrawalMethod(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="bank-transfer">
                                                    Bank Transfer
                                                </option>
                                                <option value="mobile-money">
                                                    Mobile Money
                                                </option>
                                                <option value="check">
                                                    Check Payment
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="request-reason"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Request Reason (Optional)
                                            </label>
                                            <textarea
                                                id="request-reason"
                                                value={requestReason}
                                                onChange={(e) =>
                                                    setRequestReason(
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Provide any additional information about this bulk withdrawal request..."
                                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={selectedAccounts.length === 0}
                                        className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Submit Bulk Withdrawal Request
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            {/* Selection Summary */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="mb-5 text-lg font-bold text-gray-900">
                                    Request Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Selected Accounts
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {selectedAccounts.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Total Amount
                                            </p>
                                            <p className="text-xl font-bold text-gray-900">
                                                ₦{totalAmount.toLocaleString()}
                                                .00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Info */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-sm font-bold text-blue-900">
                                        Processing Information
                                    </h3>
                                </div>
                                <ul className="space-y-2 text-xs text-blue-800">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-blue-600">
                                            •
                                        </span>
                                        <span>
                                            Bulk withdrawal requests are
                                            processed within 2-3 business days
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-blue-600">
                                            •
                                        </span>
                                        <span>
                                            You will receive email notifications
                                            for each stage of processing
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-blue-600">
                                            •
                                        </span>
                                        <span>
                                            All accounts must be fully settled
                                            and cleared for withdrawal
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-blue-600">
                                            •
                                        </span>
                                        <span>
                                            Transaction fees may apply based on
                                            withdrawal method
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Recent Requests */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-bold text-gray-900">
                                    Recent Requests
                                </h3>
                                <div className="space-y-3">
                                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                                Pending
                                            </span>
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            3 Accounts
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            ₦1,380,000.00 • Oct 10, 2025
                                        </p>
                                    </div>
                                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                Completed
                                            </span>
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            5 Accounts
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            ₦2,500,000.00 • Oct 5, 2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default RequestBulkWithdrawal;
