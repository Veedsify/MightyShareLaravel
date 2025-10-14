import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    Bell,
    CheckCircle,
    CreditCard,
    Package,
    TrendingUp,
} from 'lucide-react';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'transaction' | 'package' | 'settlement' | 'system';
    read: boolean;
    date: string;
    icon: typeof Bell;
};

const Notifications = () => {
    const notifications: Notification[] = [
        {
            id: '1',
            title: 'Deposit Successful',
            message: 'Your deposit of ₦50,000 has been credited to your wallet',
            type: 'transaction',
            read: false,
            date: '2 hours ago',
            icon: CreditCard,
        },
        {
            id: '2',
            title: 'Package Maturity Alert',
            message: 'Your Gold Package will mature in 7 days',
            type: 'package',
            read: false,
            date: '5 hours ago',
            icon: Package,
        },
        {
            id: '3',
            title: 'Settlement Completed',
            message: 'Settlement of ₦125,000 has been processed',
            type: 'settlement',
            read: true,
            date: '1 day ago',
            icon: CheckCircle,
        },
        {
            id: '4',
            title: 'New Feature Available',
            message: 'Check out our new quick transfer feature',
            type: 'system',
            read: true,
            date: '2 days ago',
            icon: TrendingUp,
        },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <>
            <Head title="Notifications" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Notifications
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Stay updated with your account activities
                            {unreadCount > 0 && (
                                <span className="ml-2 rounded-full bg-pink-500 px-2 py-0.5 text-xs font-semibold text-white">
                                    {unreadCount} New
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    'rounded-lg border p-6 transition-all hover:shadow-md',
                                    notification.read
                                        ? 'border-gray-200 bg-white'
                                        : 'border-blue-200 bg-blue-50',
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'rounded-full p-3',
                                            notification.type ===
                                                'transaction' &&
                                                'bg-blue-100 text-blue-600',
                                            notification.type === 'package' &&
                                                'bg-purple-100 text-purple-600',
                                            notification.type ===
                                                'settlement' &&
                                                'bg-green-100 text-green-600',
                                            notification.type === 'system' &&
                                                'bg-gray-100 text-gray-600',
                                        )}
                                    >
                                        <notification.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="ml-2 h-2 w-2 rounded-full bg-pink-500" />
                                            )}
                                        </div>
                                        <p className="mb-2 text-sm text-gray-600">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {notification.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Notifications;
