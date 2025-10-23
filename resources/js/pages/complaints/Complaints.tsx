import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

type ComplaintReply = {
    id: string;
    message: string;
    type: 'reply' | 'note' | 'resolution';
    user: string;
    date: string;
};

type Complaint = {
    id: string;
    subject: string;
    category: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved';
    date: string;
    ticketNo: string;
    priority: string;
    replies: ComplaintReply[];
};

type Props = {
    complaints: Complaint[];
};

const Complaints = ({ complaints }: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [expandedComplaints, setExpandedComplaints] = useState<Set<string>>(
        new Set(),
    );
    const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');

    const toggleExpanded = (id: string) => {
        const newSet = new Set(expandedComplaints);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedComplaints(newSet);
    };

    const handleSubmitComplaint = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        router.post('/dashboard/complaints/store', {
            subject: formData.get('subject'),
            category: formData.get('category'),
            description: formData.get('description'),
        });

        setShowForm(false);
    };

    const handleSubmitReply = (complaintId: string) => {
        if (!replyMessage.trim()) return;

        router.post(`/dashboard/complaints/${complaintId}/reply`, {
            message: replyMessage,
        });

        setReplyMessage('');
        setShowReplyForm(null);
    };

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
                        <div className="mb-6 border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Submit a Complaint
                            </h3>
                            <form
                                onSubmit={handleSubmitComplaint}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Brief description of your issue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="account">Account</option>
                                        <option value="transaction">
                                            Transaction
                                        </option>
                                        <option value="service">Service</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Provide details about your complaint..."
                                        required
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
                        {complaints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center border border-gray-200 bg-white py-12">
                                <AlertCircle className="mb-4 h-16 w-16 text-gray-300" />
                                <p className="text-lg font-semibold text-gray-900">
                                    No complaints yet
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Submit a complaint to get started with our
                                    support team
                                </p>
                            </div>
                        ) : (
                            complaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="border border-gray-200 bg-white shadow-sm"
                                >
                                    <div
                                        className="cursor-pointer p-6"
                                        onClick={() =>
                                            toggleExpanded(complaint.id)
                                        }
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
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2 py-1 text-xs font-medium',
                                                            complaint.priority ===
                                                                'urgent' &&
                                                                'bg-red-100 text-red-700',
                                                            complaint.priority ===
                                                                'high' &&
                                                                'bg-orange-100 text-orange-700',
                                                            complaint.priority ===
                                                                'normal' &&
                                                                'bg-gray-100 text-gray-700',
                                                            complaint.priority ===
                                                                'low' &&
                                                                'bg-gray-100 text-gray-700',
                                                        )}
                                                    >
                                                        {complaint.priority}
                                                    </span>
                                                </div>
                                                <p className="mb-3 text-sm text-gray-600">
                                                    {complaint.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>
                                                        Ticket:{' '}
                                                        {complaint.ticketNo}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Category:{' '}
                                                        {complaint.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {complaint.date}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {
                                                            complaint.replies
                                                                .length
                                                        }{' '}
                                                        replies
                                                    </span>
                                                </div>
                                            </div>
                                            <AlertCircle className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>

                                    {expandedComplaints.has(complaint.id) && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                                            <div className="mb-6 space-y-4">
                                                <h4 className="font-semibold text-gray-900">
                                                    Conversation (
                                                    {complaint.replies.length})
                                                </h4>
                                                {complaint.replies.length ===
                                                0 ? (
                                                    <p className="text-sm text-gray-500">
                                                        No replies yet
                                                    </p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {complaint.replies.map(
                                                            (reply) => (
                                                                <div
                                                                    key={
                                                                        reply.id
                                                                    }
                                                                    className="rounded border border-gray-200 bg-white p-3"
                                                                >
                                                                    <div className="mb-2 flex items-start justify-between">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">
                                                                                {
                                                                                    reply.user
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {
                                                                                    reply.date
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                                            {
                                                                                reply.type
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">
                                                                        {
                                                                            reply.message
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {showReplyForm === complaint.id ? (
                                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                                    <textarea
                                                        value={replyMessage}
                                                        onChange={(e) =>
                                                            setReplyMessage(
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={3}
                                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                        placeholder="Add your reply..."
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleSubmitReply(
                                                                    complaint.id,
                                                                )
                                                            }
                                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                                        >
                                                            <Send className="mr-2 inline-block h-4 w-4" />
                                                            Send
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setShowReplyForm(
                                                                    null,
                                                                )
                                                            }
                                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setShowReplyForm(
                                                            complaint.id,
                                                        )
                                                    }
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    Add Reply
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Complaints;
