import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Building2, CreditCard, Wallet } from 'lucide-react';
import { useState } from 'react';

type AccountType = 'bank' | 'mobile' | 'card';

const AddAccount = () => {
    const [selectedType, setSelectedType] = useState<AccountType>('bank');
    const [formData, setFormData] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        phoneNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const accountTypes = [
        {
            id: 'bank' as AccountType,
            name: 'Bank Account',
            icon: Building2,
            description: 'Add your bank account for deposits and withdrawals',
        },
        {
            id: 'mobile' as AccountType,
            name: 'Mobile Money',
            icon: Wallet,
            description: 'Link your mobile money account',
        },
        {
            id: 'card' as AccountType,
            name: 'Card',
            icon: CreditCard,
            description: 'Add a debit or credit card',
        },
    ];

    const nigerianBanks = [
        'Access Bank',
        'Zenith Bank',
        'GTBank',
        'First Bank',
        'UBA',
        'Fidelity Bank',
        'Union Bank',
        'Stanbic IBTC',
        'Sterling Bank',
        'Wema Bank',
        'Polaris Bank',
        'Keystone Bank',
        'FCMB',
        'Ecobank',
        'Heritage Bank',
        'Providus Bank',
        'Kuda Bank',
        'OPay',
        'PalmPay',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Head title="Add Account" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Add New Account
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Link your bank account, mobile money, or card to
                            start transacting
                        </p>
                    </div>

                    {/* Account Type Selection */}
                    <div className="mb-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Select Account Type
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {accountTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        'rounded-lg border-2 p-6 text-left transition-all duration-200',
                                        selectedType === type.id
                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm',
                                    )}
                                    type="button"
                                >
                                    <type.icon
                                        className={cn(
                                            'mb-3 h-8 w-8',
                                            selectedType === type.id
                                                ? 'text-blue-600'
                                                : 'text-gray-600',
                                        )}
                                    />
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                        {type.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {type.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <form onSubmit={handleSubmit}>
                            {selectedType === 'bank' && (
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="accountName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Account Name
                                        </label>
                                        <input
                                            type="text"
                                            id="accountName"
                                            name="accountName"
                                            value={formData.accountName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter account holder name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="bankName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Bank Name
                                        </label>
                                        <select
                                            id="bankName"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            required
                                        >
                                            <option value="">
                                                Select your bank
                                            </option>
                                            {nigerianBanks.map((bank) => (
                                                <option key={bank} value={bank}>
                                                    {bank}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="accountNumber"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            id="accountNumber"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="0123456789"
                                            maxLength={10}
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter your 10-digit account number
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedType === 'mobile' && (
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="accountName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Account Name
                                        </label>
                                        <input
                                            type="text"
                                            id="accountName"
                                            name="accountName"
                                            value={formData.accountName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phoneNumber"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="08012345678"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="bankName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Service Provider
                                        </label>
                                        <select
                                            id="bankName"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            required
                                        >
                                            <option value="">
                                                Select provider
                                            </option>
                                            <option value="OPay">OPay</option>
                                            <option value="PalmPay">
                                                PalmPay
                                            </option>
                                            <option value="Kuda">Kuda</option>
                                            <option value="MTN">
                                                MTN MoMo
                                            </option>
                                            <option value="Airtel">
                                                Airtel Money
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {selectedType === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="cardNumber"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="accountName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            id="accountName"
                                            name="accountName"
                                            value={formData.accountName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Name on card"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="expiryDate"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                id="expiryDate"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="cvv"
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                placeholder="123"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="mt-6 flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-md py-3 font-medium"
                                >
                                    Add Account
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-md px-6 py-3 font-medium"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-blue-900">
                            🔒 Your information is secure
                        </h3>
                        <p className="text-sm text-blue-700">
                            We use bank-level encryption to protect your
                            financial information. Your data is never shared
                            with third parties without your consent.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default AddAccount;
