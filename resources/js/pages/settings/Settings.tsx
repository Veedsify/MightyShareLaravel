import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Bell, Lock, Shield, User } from 'lucide-react';

const Settings = () => {
    return (
        <>
            <Head title="Settings" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Settings
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage your account preferences and security
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <User className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Profile Information
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="John Doe"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="john@example.com"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue="+234 801 234 5678"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                </div>
                                <Button className="rounded-md">
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Lock className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Security
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                        />
                                    </div>
                                </div>
                                <Button className="rounded-md">
                                    Update Password
                                </Button>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Two-Factor Authentication
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Add an extra layer of security
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-md"
                                >
                                    Enable 2FA
                                </Button>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Bell className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Notification Preferences
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                        Email Notifications
                                    </span>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                        SMS Notifications
                                    </span>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                        Transaction Alerts
                                    </span>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                        Marketing Emails
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Settings;
