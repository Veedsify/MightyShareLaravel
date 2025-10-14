import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Package as PackageIcon,
    TrendingUp,
} from 'lucide-react';

type Package = {
    id: string;
    name: string;
    description: string;
    duration: string;
    minAmount: number;
    maxAmount: number;
    returnRate: number;
    color: string;
    popular?: boolean;
};

const Packages = () => {
    const packages: Package[] = [
        {
            id: '1',
            name: 'Bronze Package',
            description: 'Perfect for beginners starting their savings journey',
            duration: '3 months',
            minAmount: 10000,
            maxAmount: 50000,
            returnRate: 5,
            color: 'from-orange-500 to-orange-600',
        },
        {
            id: '2',
            name: 'Silver Package',
            description:
                'Great for consistent savers looking for better returns',
            duration: '6 months',
            minAmount: 50000,
            maxAmount: 150000,
            returnRate: 8,
            color: 'from-gray-400 to-gray-500',
            popular: true,
        },
        {
            id: '3',
            name: 'Gold Package',
            description: 'Premium savings with excellent return rates',
            duration: '9 months',
            minAmount: 150000,
            maxAmount: 500000,
            returnRate: 12,
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            id: '4',
            name: 'Platinum Package',
            description: 'Ultimate savings plan for maximum returns',
            duration: '12 months',
            minAmount: 500000,
            maxAmount: 2000000,
            returnRate: 15,
            color: 'from-blue-600 to-blue-700',
        },
    ];

    return (
        <>
            <Head title="Thrift Packages" />
            <DashboardLayout>
                <div className="bg-gray-50 p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Thrift Packages
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Choose a package that suits your savings goals
                        </p>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
                            >
                                {pkg.popular && (
                                    <span className="absolute -top-3 right-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </span>
                                )}
                                <div
                                    className={cn(
                                        'mb-4 inline-flex rounded-lg bg-gradient-to-br p-4',
                                        pkg.color,
                                    )}
                                >
                                    <PackageIcon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    {pkg.name}
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    {pkg.description}
                                </p>
                                <div className="mb-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700">
                                            Duration: {pkg.duration}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <span className="font-semibold text-green-600">
                                            {pkg.returnRate}% Returns
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                                    <p className="text-xs text-gray-600">
                                        Amount Range
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₦{pkg.minAmount.toLocaleString('en-NG')}{' '}
                                        - ₦
                                        {pkg.maxAmount.toLocaleString('en-NG')}
                                    </p>
                                </div>
                                <Button className="w-full rounded-md font-medium">
                                    Subscribe Now
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-blue-900">
                            How It Works
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    1
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold text-blue-900">
                                        Choose Package
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        Select a package that fits your budget
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    2
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold text-blue-900">
                                        Make Deposits
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        Deposit funds into your package
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    3
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold text-blue-900">
                                        Earn Returns
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        Get your savings plus returns at
                                        maturity
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Your Active Packages
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-100 p-3">
                                        <PackageIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Gold Package
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            ₦200,000 • Matures in 45 days
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-gray-100 p-3">
                                        <PackageIcon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Silver Package
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            ₦100,000 • Matures in 90 days
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Packages;
