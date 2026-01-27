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
    id: number;
    name: string;
    price: number;
    duration: number;
    profit_percentage: number;
    description: string;
    terms: string;
    is_active: boolean;
    min_contribution: number;
    max_contribution: number;
    number_of_accounts: number;
    min_number_of_accounts: number;
    features: string[];
};

type MySubscription = {
    id: number;
    user_id: number;
    package_id: number;
    amount_invested: number;
    start_date: string;
    end_date: string;
    status: string;
    expected_return: number;
    actual_return: number | null;
    completed_at: string | null;
    cancelled_at: string | null;
    notes: string | null;
    package: Package;
};

const Packages = ({
    packages,
    mySubscriptions,
}: {
    packages: Package[];
    mySubscriptions: MySubscription[];
}) => {
    const handleSubscribe = (packageId: number) => {
        console.log(`Subscribed to package with ID: ${packageId}`);
    };

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
                        {packages.map((pkg, idx: number) => (
                            <div
                                key={`${pkg.name}-${idx}`}
                                className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
                            >
                                {idx == 1 && (
                                    <span className="absolute -top-3 right-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </span>
                                )}
                                <div
                                    className={cn(
                                        'mb-4 inline-flex rounded-lg bg-gradient-to-br p-4',
                                        'bg-gradient-to-r from-blue-500 to-indigo-600',
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
                                            Duration: {pkg.duration} weeks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <span className="font-semibold text-green-600">
                                            {/* {pkg.returnRate}% Returns */}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                                    <p className="text-xs text-gray-600">
                                        Amount Range
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₦
                                        {pkg.min_contribution.toLocaleString(
                                            'en-NG',
                                        )}{' '}
                                        - ₦
                                        {pkg.max_contribution.toLocaleString(
                                            'en-NG',
                                        )}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleSubscribe(pkg.id)}
                                    className="w-full rounded-md font-medium"
                                >
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
                            {mySubscriptions &&
                                mySubscriptions.map((sub) => (
                                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-blue-100 p-3">
                                                <PackageIcon className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {sub.package.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Started on:{' '}
                                                    {new Date(
                                                        sub.start_date,
                                                    ).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            <CheckCircle className="h-4 w-4" />
                                            {sub.status}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default Packages;
