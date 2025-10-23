import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import type { SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
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
        date_of_birth?: string;
        bvn?: string;
    };
    notifications: {
        email_notifications: boolean;
        sms_notifications: boolean;
        transaction_alerts: boolean;
        marketing_emails: boolean;
    };
    staticAccount?: {
        account_number: string;
        bank_name: string;
        balance: number;
        created_at: string;
    };
}

const Settings = () => {
    const { user, staticAccount, notifications } =
        usePage<SettingsPageProps>().props;
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [walletId, setWalletId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [bvn, setBvn] = useState('');
    const [editMode, setEditMode] = useState(false);

    // Profile form
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth || '',
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Notification preferences form
    const notificationsForm = useForm({
        email_notifications: notifications?.email_notifications ?? true,
        sms_notifications: notifications?.sms_notifications ?? true,
        transaction_alerts: notifications?.transaction_alerts ?? true,
        marketing_emails: notifications?.marketing_emails ?? false,
    });

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

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/dashboard/settings/profile', {
            onSuccess: () => {
                setEditMode(false);
                alert('Profile updated successfully!');
            },
            onError: () => {
                alert('Failed to update profile. Please try again.');
            },
        });
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/dashboard/settings/password', {
            onSuccess: () => {
                passwordForm.reset();
                alert('Password updated successfully!');
            },
            onError: () => {
                alert('Failed to update password. Please try again.');
            },
        });
    };

    const handleNotificationsUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        notificationsForm.put('/dashboard/settings/notifications', {
            onSuccess: () => {
                alert('Notification preferences updated!');
            },
            onError: () => {
                alert('Failed to update preferences. Please try again.');
            },
        });
    };

    return (
        <>
            <Head title="Settings" />
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 lg:p-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-end gap-6">
                            {/* Profile Avatar */}
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                    <User className="h-12 w-12 text-white" />
                                </div>
                                <div className="absolute right-0 bottom-0 h-7 w-7 rounded-full border-2 border-white bg-green-500"></div>
                            </div>
                            <div className="pb-2">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Profile Setting
                                </h1>
                                <p className="mt-1 text-gray-500">
                                    Manage your account, security & preferences
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Static Account Section */}
                        <div className="grid xl:grid-cols-2 xl:gap-8">
                            <div className="border border-gray-200 bg-white p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="bg-blue-100 p-3">
                                        <Wallet className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Static Account
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Dedicated wallet for deposits
                                        </p>
                                    </div>
                                </div>

                                {staticAccount ? (
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-green-500 bg-green-50 p-6">
                                            <div className="mb-6 flex items-center gap-3">
                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                                <p className="text-lg font-bold text-green-900">
                                                    Account Active & Verified
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="border border-green-200 bg-white p-4">
                                                    <p className="text-xs font-semibold text-green-700 uppercase">
                                                        Account Number
                                                    </p>
                                                    <p className="mt-2 font-mono text-2xl font-bold text-gray-900">
                                                        {
                                                            staticAccount.account_number
                                                        }
                                                    </p>
                                                </div>
                                                <div className="border border-green-200 bg-white p-4">
                                                    <p className="text-xs font-semibold text-green-700 uppercase">
                                                        Bank Name
                                                    </p>
                                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                                        {staticAccount.bank_name}
                                                    </p>
                                                </div>
                                                <div className="border border-green-200 bg-white p-4">
                                                    <p className="text-xs font-semibold text-green-700 uppercase">
                                                        Available Balance
                                                    </p>
                                                    <p className="mt-2 text-2xl font-bold text-green-600">
                                                        ₦
                                                        {staticAccount.balance.toLocaleString(
                                                            'en-NG',
                                                            {
                                                                minimumFractionDigits: 2,
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="border border-green-200 bg-white p-4">
                                                    <p className="text-xs font-semibold text-green-700 uppercase">
                                                        Created On
                                                    </p>
                                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                                        {new Date(
                                                            staticAccount.created_at,
                                                        ).toLocaleDateString(
                                                            'en-NG',
                                                            {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 border border-blue-200 bg-blue-50 p-4">
                                            <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                            <div>
                                                <p className="font-semibold text-blue-900">
                                                    How to use this account
                                                </p>
                                                <p className="mt-1 text-sm text-blue-800">
                                                    Transfer funds to your static
                                                    account number above to
                                                    instantly fund your MightyShare
                                                    wallet.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                                            <p className="font-semibold text-blue-900">
                                                Get Your Dedicated Bank Account
                                            </p>
                                            <p className="mt-2 text-sm text-blue-800">
                                                Create a dedicated static account to
                                                fund your MightyShare wallet. You'll
                                                receive a unique account number that
                                                you can use for deposits from any
                                                bank.
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 bg-gray-50 p-6">
                                            <label className="mb-3 block text-sm font-bold text-gray-700 uppercase">
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
                                                placeholder="00000000000"
                                                className="w-full border border-gray-300 bg-white px-4 py-3 font-mono text-lg tracking-wider focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <p className="mt-2 text-xs text-gray-600">
                                                Your BVN is required for account
                                                verification and security. This is
                                                an 11-digit number.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleGenerateStaticAccount}
                                            disabled={
                                                isGenerating || bvn.length !== 11
                                            }
                                            className="w-full bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
                                        >
                                            {isGenerating
                                                ? 'Generating...'
                                                : 'Generate Static Account'}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Profile Settings */}
                            <div className="border border-gray-200 bg-white p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-3">
                                            <User className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Profile Information
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Your personal details
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className="border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        {editMode ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleProfileUpdate}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="border border-gray-200 bg-gray-50 p-4">
                                            <label className="mb-2 block text-xs font-bold text-gray-700 uppercase">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                disabled={!editMode}
                                            />
                                            {profileForm.errors.name && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {profileForm.errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="border border-gray-200 bg-gray-50 p-4">
                                            <label className="mb-2 block text-xs font-bold text-gray-700 uppercase">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                disabled={!editMode}
                                            />
                                            {profileForm.errors.email && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {profileForm.errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="border border-gray-200 bg-gray-50 p-4">
                                            <label className="mb-2 block text-xs font-bold text-gray-700 uppercase">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileForm.data.phone}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                disabled={!editMode}
                                            />
                                            {profileForm.errors.phone && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {profileForm.errors.phone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="border border-gray-200 bg-gray-50 p-4">
                                            <label className="mb-2 block text-xs font-bold text-gray-700 uppercase">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={
                                                    profileForm.data.date_of_birth
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'date_of_birth',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                disabled={!editMode}
                                            />
                                            {profileForm.errors.date_of_birth && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {
                                                        profileForm.errors
                                                            .date_of_birth
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {editMode && (
                                        <Button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="w-full bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
                                        >
                                            {profileForm.processing
                                                ? 'Saving...'
                                                : 'Save Changes'}
                                        </Button>
                                    )}
                                </form>
                            </div>
                        </div>

                        <div className="grid xl:grid-cols-2 xl:gap-8">
                            {/* Security Settings */}
                            <div className="border border-gray-200 bg-white p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="bg-red-100 p-3">
                                        <Lock className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Security
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Manage your passwords and security
                                        </p>
                                    </div>
                                </div>
                                <form
                                    onSubmit={handlePasswordUpdate}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="mb-3 block text-sm font-bold text-gray-700 uppercase">
                                            Current Password
                                        </label>
                                        <div className="border border-gray-200 bg-gray-50 p-4">
                                            <input
                                                type="password"
                                                value={
                                                    passwordForm.data
                                                        .current_password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        'current_password',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {passwordForm.errors
                                                .current_password && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {
                                                        passwordForm.errors
                                                            .current_password
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-3 block text-sm font-bold text-gray-700 uppercase">
                                                New Password
                                            </label>
                                            <div className="border border-gray-200 bg-gray-50 p-4">
                                                <input
                                                    type="password"
                                                    value={
                                                        passwordForm.data
                                                            .password
                                                    }
                                                    onChange={(e) =>
                                                        passwordForm.setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                />
                                                {passwordForm.errors
                                                    .password && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {
                                                            passwordForm.errors
                                                                .password
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-3 block text-sm font-bold text-gray-700 uppercase">
                                                Confirm Password
                                            </label>
                                            <div className="border border-gray-200 bg-gray-50 p-4">
                                                <input
                                                    type="password"
                                                    value={
                                                        passwordForm.data
                                                            .password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        passwordForm.setData(
                                                            'password_confirmation',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                />
                                                {passwordForm.errors
                                                    .password_confirmation && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {
                                                            passwordForm.errors
                                                                .password_confirmation
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-l-4 border-yellow-500 bg-yellow-50 p-4">
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-900">
                                                Strong Password Recommended
                                            </p>
                                            <p className="mt-1 text-xs text-yellow-800">
                                                Use at least 8 characters with a
                                                mix of uppercase, lowercase,
                                                numbers, and symbols
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="w-full bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:bg-gray-300"
                                    >
                                        {passwordForm.processing
                                            ? 'Updating...'
                                            : 'Update Password'}
                                    </Button>
                                </form>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="border border-gray-200 bg-white p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-3">
                                            <Shield className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Two-Factor Authentication
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Extra layer of security
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                                        <p className="text-sm font-semibold text-blue-900">
                                            Protect Your Account
                                        </p>
                                        <p className="mt-2 text-xs text-blue-800">
                                            Two-factor authentication adds an
                                            extra security layer by requiring a
                                            verification code in addition to
                                            your password when logging in.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full border-2 border-green-600 py-3 font-bold text-green-600 hover:bg-green-50"
                                    >
                                        Enable 2FA
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="border border-gray-200 bg-white p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="bg-orange-100 p-3">
                                    <Bell className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Notification Preferences
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Choose how to stay updated
                                    </p>
                                </div>
                            </div>
                            <form onSubmit={handleNotificationsUpdate}>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Email Notifications
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Receive updates via email
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={
                                                notificationsForm.data
                                                    .email_notifications
                                            }
                                            onChange={(e) =>
                                                notificationsForm.setData(
                                                    'email_notifications',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-5 w-5 cursor-pointer border border-gray-300 text-blue-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                SMS Notifications
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Get text alerts for important
                                                events
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={
                                                notificationsForm.data
                                                    .sms_notifications
                                            }
                                            onChange={(e) =>
                                                notificationsForm.setData(
                                                    'sms_notifications',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-5 w-5 cursor-pointer border border-gray-300 text-blue-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Transaction Alerts
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Notify on every transaction
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={
                                                notificationsForm.data
                                                    .transaction_alerts
                                            }
                                            onChange={(e) =>
                                                notificationsForm.setData(
                                                    'transaction_alerts',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-5 w-5 cursor-pointer border border-gray-300 text-blue-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Marketing & Promotions
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Stay informed about offers
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={
                                                notificationsForm.data
                                                    .marketing_emails
                                            }
                                            onChange={(e) =>
                                                notificationsForm.setData(
                                                    'marketing_emails',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-5 w-5 cursor-pointer border border-gray-300 text-blue-600"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        type="submit"
                                        disabled={notificationsForm.processing}
                                        className="w-full bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:bg-gray-300"
                                    >
                                        {notificationsForm.processing
                                            ? 'Saving...'
                                            : 'Save Preferences'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* OTP Verification Modal */}
                    {showOtpModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-md border border-gray-200 bg-white p-8">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    Verify OTP
                                </h3>
                                <p className="mb-6 text-sm text-gray-600">
                                    An OTP has been sent to your registered
                                    phone number. Please enter it below to
                                    complete wallet creation.
                                </p>
                                <div className="mb-6">
                                    <label
                                        htmlFor="otp"
                                        className="mb-3 block text-sm font-bold text-gray-700 uppercase"
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
                                        placeholder="000000"
                                        className="w-full border-2 border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowOtpModal(false);
                                            setOtp('');
                                            setIsGenerating(false);
                                        }}
                                        disabled={isGenerating}
                                        className="flex-1 border-2 border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 uppercase transition-colors hover:bg-gray-50 disabled:opacity-50"
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={
                                            isGenerating || otp.length !== 6
                                        }
                                        className="flex-1 bg-blue-600 px-4 py-3 text-sm font-bold text-white uppercase transition-colors hover:bg-blue-700 disabled:opacity-50"
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
