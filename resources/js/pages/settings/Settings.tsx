import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import type { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle,
    CreditCard,
    Lock,
    Shield,
    User,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface SettingsPageProps extends SharedData {
    user: {
        name: string;
        email: string;
        phone: string;
        bvn?: string;
    };
    staticAccount?: {
        account_number: string;
        bank_name: string;
        balance: number;
        created_at: string;
    };
}

const Settings = () => {
    const { user, staticAccount } = usePage<SettingsPageProps>().props;
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [walletId, setWalletId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [bvn, setBvn] = useState('');

    const handleGenerateStaticAccount = () => {
        if (!bvn || bvn.length !== 11) {
            alert('Please enter a valid 11-digit BVN');
            return;
        }

        setIsGenerating(true);

        router.post(
            '/dashboard/settings/static-account/create',
            { bvn },
            {
                onSuccess: (response) => {
                    const data = response.props as { walletId?: string };
                    if (data.walletId) {
                        setWalletId(data.walletId);
                        setShowOtpModal(true);
                    }
                    setIsGenerating(false);
                },
                onError: () => {
                    setIsGenerating(false);
                    alert(
                        'Failed to initiate wallet creation. Please try again.',
                    );
                },
            },
        );
    };

    const handleVerifyOtp = () => {
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        setIsGenerating(true);

        router.post(
            '/dashboard/settings/static-account/verify',
            { walletId, otp },
            {
                onSuccess: () => {
                    setShowOtpModal(false);
                    setOtp('');
                    setWalletId('');
                    setBvn('');
                    setIsGenerating(false);
                    alert('Static account created successfully!');
                },
                onError: () => {
                    setIsGenerating(false);
                    alert('OTP verification failed. Please try again.');
                },
            },
        );
    };

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
                        {/* Static Account Section */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Wallet className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Static Account
                                </h2>
                            </div>

                            {staticAccount ? (
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <p className="font-semibold text-green-900">
                                                Account Active
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div>
                                                <p className="text-sm text-green-700">
                                                    Account Number
                                                </p>
                                                <p className="font-mono text-lg font-semibold text-green-900">
                                                    {
                                                        staticAccount.account_number
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">
                                                    Bank Name
                                                </p>
                                                <p className="font-semibold text-green-900">
                                                    {staticAccount.bank_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">
                                                    Balance
                                                </p>
                                                <p className="text-lg font-semibold text-green-900">
                                                    ₦
                                                    {staticAccount.balance.toLocaleString(
                                                        'en-NG',
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">
                                                    Created On
                                                </p>
                                                <p className="font-semibold text-green-900">
                                                    {new Date(
                                                        staticAccount.created_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <CreditCard className="mr-1 inline h-4 w-4" />
                                        Use this account number to fund your
                                        MightyShare wallet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <p className="text-sm text-blue-900">
                                            Create a dedicated static account to
                                            fund your MightyShare wallet. You'll
                                            receive a unique account number that
                                            you can use for deposits.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Bank Verification Number (BVN)
                                        </label>
                                        <input
                                            type="text"
                                            value={bvn}
                                            onChange={(e) =>
                                                setBvn(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            maxLength={11}
                                            placeholder="Enter your 11-digit BVN"
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Your BVN is required for account
                                            verification and security
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleGenerateStaticAccount}
                                        disabled={
                                            isGenerating || bvn.length !== 11
                                        }
                                        className="rounded-md"
                                    >
                                        {isGenerating
                                            ? 'Generating...'
                                            : 'Generate Static Account'}
                                    </Button>
                                </div>
                            )}
                        </div>

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
                                            defaultValue={user.name}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={user.email}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue={user.phone}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5"
                                            disabled
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

                    {/* OTP Verification Modal */}
                    {showOtpModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                                <h3 className="mb-4 text-xl font-bold text-gray-900">
                                    Verify OTP
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    An OTP has been sent to your registered
                                    phone number. Please enter it below to
                                    complete wallet creation.
                                </p>
                                <div className="mb-4">
                                    <label
                                        htmlFor="otp"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        maxLength={6}
                                        placeholder="6-digit OTP"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-center text-lg font-semibold tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowOtpModal(false);
                                            setOtp('');
                                            setIsGenerating(false);
                                        }}
                                        disabled={isGenerating}
                                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={
                                            isGenerating || otp.length !== 6
                                        }
                                        className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                        type="button"
                                    >
                                        {isGenerating
                                            ? 'Verifying...'
                                            : 'Verify OTP'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default Settings;
