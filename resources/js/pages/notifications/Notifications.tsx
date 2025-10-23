import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
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
};

const iconMap = {
    transaction: CreditCard,
    package: Package,
    settlement: CheckCircle,
    system: TrendingUp,
};

type Props = {
    notifications: Notification[];
};

const Notifications = ({ notifications }: Props) => {
    const markAsRead = (id: string) => {
        router.post(
            `/api/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/api/notifications/read-all',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <>
            <Head title="Notifications" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
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
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-gray-200 bg-white py-12">
                            <Bell className="mb-4 h-16 w-16 text-gray-300" />
                            <p className="text-lg font-semibold text-gray-900">
                                No notifications yet
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                You'll see notifications here when you have them
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => {
                                const Icon = iconMap[notification.type] || Bell;
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'cursor-pointer border p-6 transition-all hover:shadow-md',
                                            notification.read
                                                ? 'border-gray-200 bg-white'
                                                : 'border-blue-200 bg-blue-50',
                                        )}
                                        onClick={() =>
                                            !notification.read &&
                                            markAsRead(notification.id)
                                        }
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={cn(
                                                    'rounded-full p-3',
                                                    notification.type ===
                                                        'transaction' &&
                                                        'bg-blue-100 text-blue-600',
                                                    notification.type ===
                                                        'package' &&
                                                        'bg-purple-100 text-purple-600',
                                                    notification.type ===
                                                        'settlement' &&
                                                        'bg-green-100 text-green-600',
                                                    notification.type ===
                                                        'system' &&
                                                        'bg-gray-100 text-gray-600',
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
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
                                );
                            })}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default Notifications;
