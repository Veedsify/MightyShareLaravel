import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Bell,
    CheckCircle,
    ChevronDown,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    Receipt,
    Settings,
    UserPlus,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';

type SubNavigationItem = {
    title: string;
    href: string;
};

type NavigationItem = {
    title: string;
    icon: LucideIcon;
    href: string;
    current?: boolean;
    subItems?: SubNavigationItem[];
};

const navigationItems: NavigationItem[] = [
    {
        title: 'Dashboard',
        icon: Home,
        href: '/dashboard',
        current: true,
    },
    {
        title: 'Add Account',
        icon: UserPlus,
        href: '/dashboard/accounts/add',
    },
    {
        title: 'Wallet',
        icon: Wallet,
        href: '/dashboard/wallet',
    },
    {
        title: 'Transactions',
        icon: Receipt,
        href: '/dashboard/transactions',
    },
    {
        title: 'Settlements',
        icon: CheckCircle,
        href: '/dashboard/settlements',
        subItems: [
            {
                title: 'Due for Clearance',
                href: '/dashboard/settlements/due-for-clearance',
            },
            {
                title: 'All Paid Accounts',
                href: '/dashboard/settlements/all-paid-accounts',
            },
            {
                title: 'Request Bulk Withdrawal',
                href: '/dashboard/settlements/request-bulk-withdrawal',
            },
            {
                title: 'Next Settlement',
                href: '/dashboard/settlements/next-settlement',
            },
        ],
    },
    {
        title: 'Thrift Packages',
        icon: Package,
        href: '/dashboard/packages',
        subItems: [
            {
                title: 'Thrift Packages',
                href: '/dashboard/packages',
            },
            {
                title: 'My Subscriptions',
                href: '/dashboard/packages/my-subscriptions',
            },
        ],
    },
    {
        title: 'Complaints',
        icon: MessageSquare,
        href: '/dashboard/complaints',
    },
    {
        title: 'Notifications',
        icon: Bell,
        href: '/dashboard/notifications',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const url = page.url;
    const userName = auth?.user?.name || 'Member';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settlementsOpen, setSettlementsOpen] = useState(false);
    const [packagesOpen, setPackagesOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-blue-200 bg-blue-600 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo/Brand with close button on mobile */}
                    <div className="flex h-16 items-center justify-between border-b border-blue-500 bg-blue-700 px-4">
                        <h1 className="text-2xl font-bold tracking-wide text-white">
                            MightyShare
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-white lg:hidden"
                            type="button"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                        {navigationItems.map((item) => {
                            const isActive =
                                url === item.href ||
                                url.startsWith(item.href + '/');

                            if (item.subItems) {
                                const isSettlements =
                                    item.title === 'Settlements';
                                // const isPackages =
                                //     item.title === 'Thrift Packages';
                                const dropdownOpen = isSettlements
                                    ? settlementsOpen
                                    : packagesOpen;
                                const setDropdownOpen = isSettlements
                                    ? setSettlementsOpen
                                    : setPackagesOpen;

                                return (
                                    <div key={item.title}>
                                        <button
                                            onClick={() =>
                                                setDropdownOpen(!dropdownOpen)
                                            }
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-white text-blue-600 shadow-md'
                                                    : 'text-blue-50 hover:bg-blue-500 hover:text-white',
                                            )}
                                            type="button"
                                        >
                                            <item.icon className="h-5 w-5 flex-shrink-0" />
                                            <span className="flex-1 truncate text-left">
                                                {item.title}
                                            </span>
                                            <ChevronDown
                                                className={cn(
                                                    'h-4 w-4 transition-transform duration-200',
                                                    dropdownOpen &&
                                                        'rotate-180',
                                                )}
                                            />
                                        </button>
                                        {dropdownOpen && (
                                            <div className="mt-2 ml-4 space-y-1 border-l-2 border-blue-400 pl-4">
                                                {item.subItems.map(
                                                    (subItem) => {
                                                        const isSubActive =
                                                            url ===
                                                            subItem.href;
                                                        return (
                                                            <Link
                                                                key={
                                                                    subItem.title
                                                                }
                                                                href={
                                                                    subItem.href
                                                                }
                                                                className={cn(
                                                                    'block rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                                                                    isSubActive
                                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                                        : 'text-blue-100 hover:bg-blue-500 hover:text-white',
                                                                )}
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'text-blue-50 hover:bg-blue-500 hover:text-white',
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-blue-500 bg-blue-700 p-4">
                        <div className="mb-3 flex items-center gap-3 rounded-md bg-blue-500 p-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-700 shadow">
                                <span className="text-sm font-bold text-white">
                                    {userInitials}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">
                                    {userName}
                                </p>
                                <p className="text-xs text-blue-100">Member</p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-pink-600 hover:shadow-md"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
                        type="button"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">
                        MightyShare
                    </h1>
                </div>

                <main className="min-h-screen">{children}</main>
            </div>
        </div>
    );
};

export { DashboardLayout };
