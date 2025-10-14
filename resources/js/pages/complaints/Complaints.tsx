import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

type Complaint = {
    id: string;
    subject: string;
    category: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved';
    date: string;
    ticketNo: string;
};

const Complaints = () => {
    const [showForm, setShowForm] = useState(false);

    const complaints: Complaint[] = [
        {
            id: '1',
            subject: 'Withdrawal not received',
            category: 'Transaction',
            description: "I initiated a withdrawal but haven't received it yet",
            status: 'in-progress',
            date: 'Oct 12, 2025',
            ticketNo: 'TKT-001234',
        },
        {
            id: '2',
            subject: 'Account verification issue',
            category: 'Account',
            description: 'Unable to verify my account documents',
            status: 'resolved',
            date: 'Oct 08, 2025',
            ticketNo: 'TKT-001233',
        },
    ];

    return (
        <>
            <Head title="Complaints" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Complaints & Support
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Submit and track your support tickets
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-md font-medium"
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            New Complaint
                        </Button>
                    </div>

                    {showForm && (
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Submit a Complaint
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Brief description of your issue"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none">
                                        <option>Transaction</option>
                                        <option>Account</option>
                                        <option>Technical</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Provide details about your complaint..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        className="rounded-md"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Complaint
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                        className="rounded-md"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {complaint.subject}
                                            </h3>
                                            <span
                                                className={cn(
                                                    'rounded-full px-3 py-1 text-xs font-medium',
                                                    complaint.status ===
                                                        'open' &&
                                                        'bg-blue-100 text-blue-700',
                                                    complaint.status ===
                                                        'in-progress' &&
                                                        'bg-yellow-100 text-yellow-700',
                                                    complaint.status ===
                                                        'resolved' &&
                                                        'bg-green-100 text-green-700',
                                                )}
                                            >
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="mb-3 text-sm text-gray-600">
                                            {complaint.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>
                                                Ticket: {complaint.ticketNo}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                Category: {complaint.category}
                                            </span>
                                            <span>•</span>
                                            <span>{complaint.date}</span>
                                        </div>
                                    </div>
                                    <AlertCircle className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Complaints;
