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
    Search,
    Settings,
    User,
    UserPlus,
    Wallet,
    X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
        href: '/dashboard/',
        current: true,
    },
    {
        title: 'Profile',
        icon: User,
        href: '/dashboard/settings',
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
                href: '/settlements/due-for-clearance',
            },
            {
                title: 'All Paid Accounts',
                href: '/settlements/all-paid-accounts',
            },
            {
                title: 'Request Bulk Withdrawal',
                href: '/settlements/request-bulk-withdrawal',
            },
            {
                title: 'Next Settlement',
                href: '/settlements/next-settlement',
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
                href: '/packages',
            },
            {
                title: 'My Subscriptions',
                href: '/packages/my-subscriptions',
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
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const url = page.url;
    const userName = auth?.user?.name || 'Member';
    const userEmail = auth?.user?.email || 'user@example.com';
    const userPhone = ((auth?.user as { phone?: string })?.phone ||
        '') as string;
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Get user accounts and notifications
    const accounts = (auth?.user as { accounts?: unknown[] })?.accounts || [];
    const notificationCount =
        ((auth?.user as { notifications?: unknown[] })?.notifications
            ?.length as number) || 0;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settlementsOpen, setSettlementsOpen] = useState(false);
    const [packagesOpen, setPackagesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(accounts[0] || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{
        transactions: unknown[];
        pages: unknown[];
    }>({ transactions: [], pages: [] });
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.length < 2) {
            setSearchResults({ transactions: [], pages: [] });
            setShowSearchDropdown(false);
            return;
        }

        setSearchLoading(true);
        setShowSearchDropdown(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/search/${encodeURIComponent(query)}`,
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults({ transactions: [], pages: [] });
            } finally {
                setSearchLoading(false);
            }
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

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
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-blue-200 bg-blue-700 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                    <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                    <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
                </div>
                <div className="flex h-full flex-col">
                    {/* Logo/Brand with close button on mobile */}
                    <div className="flex h-16 items-center gap-4 border-b border-blue-500 bg-blue-700 px-4">
                        <img
                            src="/images/logo.jpg"
                            alt="MightyShare Logo"
                            className="h-12 w-12 rounded-full"
                        />
                        <h1 className="hidden text-2xl font-bold text-white md:block">
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
                                url === item.href || url.startsWith(item.href);

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
                                                            <a
                                                                key={
                                                                    subItem.title
                                                                }
                                                                href={
                                                                    '/dashboard' +
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
                                                            </a>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <a
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
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </a>
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
                {/* Top Navbar */}
                <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                                type="button"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Search Bar */}
                            <div className="relative hidden w-96 md:block">
                                <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search transactions, pages..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        onFocus={() =>
                                            searchQuery.length >= 2 &&
                                            setShowSearchDropdown(true)
                                        }
                                        className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Search Results Dropdown */}
                                {showSearchDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setShowSearchDropdown(false)
                                            }
                                        />
                                        <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                            {searchLoading && (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    Searching...
                                                </div>
                                            )}

                                            {!searchLoading &&
                                                searchResults.pages.length ===
                                                0 &&
                                                searchResults.transactions
                                                    .length === 0 && (
                                                    <div className="px-4 py-8 text-center text-gray-500">
                                                        No results found
                                                    </div>
                                                )}

                                            {/* Pages */}
                                            {!searchLoading &&
                                                searchResults.pages.length >
                                                0 && (
                                                    <>
                                                        <div className="border-b border-gray-200 px-4 py-2">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                                                Pages
                                                            </p>
                                                        </div>
                                                        {(
                                                            searchResults.pages as unknown[]
                                                        ).map(
                                                            (
                                                                page: unknown,
                                                                idx: number,
                                                            ) => {
                                                                const p =
                                                                    page as {
                                                                        title: string;
                                                                        url: string;
                                                                        icon?: string;
                                                                    };
                                                                return (
                                                                    <Link
                                                                        key={
                                                                            idx
                                                                        }
                                                                        href={
                                                                            p.url
                                                                        }
                                                                        onClick={() => {
                                                                            setShowSearchDropdown(
                                                                                false,
                                                                            );
                                                                            setSearchQuery(
                                                                                '',
                                                                            );
                                                                        }}
                                                                        className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
                                                                            <span className="text-xs font-semibold text-blue-600">
                                                                                {p
                                                                                    .icon?.[0] ||
                                                                                    '📄'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    p.title
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {
                                                                                    p.url
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            },
                                                        )}
                                                    </>
                                                )}

                                            {/* Transactions */}
                                            {!searchLoading &&
                                                searchResults.transactions
                                                    .length > 0 && (
                                                    <>
                                                        <div className="border-b border-gray-200 px-4 py-2">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                                                Transactions
                                                            </p>
                                                        </div>
                                                        {(
                                                            searchResults.transactions as unknown[]
                                                        ).map(
                                                            (
                                                                txn: unknown,
                                                                idx: number,
                                                            ) => {
                                                                const t =
                                                                    txn as {
                                                                        id: string;
                                                                        title: string;
                                                                        subtitle?: string;
                                                                        amount?: string;
                                                                        date?: string;
                                                                        url?: string;
                                                                    };
                                                                return (
                                                                    <Link
                                                                        key={
                                                                            idx
                                                                        }
                                                                        href={
                                                                            t.url ||
                                                                            '/dashboard/transactions'
                                                                        }
                                                                        onClick={() => {
                                                                            setShowSearchDropdown(
                                                                                false,
                                                                            );
                                                                            setSearchQuery(
                                                                                '',
                                                                            );
                                                                        }}
                                                                        className="flex items-center justify-between border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    t.title
                                                                                }
                                                                            </p>
                                                                            {t.subtitle && (
                                                                                <p className="text-xs text-gray-500">
                                                                                    {
                                                                                        t.subtitle
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                            {t.date && (
                                                                                <p className="text-xs text-gray-400">
                                                                                    {
                                                                                        t.date
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {t.amount && (
                                                                            <p className="text-sm font-semibold text-green-600">
                                                                                {
                                                                                    t.amount
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </Link>
                                                                );
                                                            },
                                                        )}
                                                    </>
                                                )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
                                type="button"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Account Switcher */}
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() =>
                                        setAccountDropdownOpen(
                                            !accountDropdownOpen,
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-md border border-blue-500 bg-blue-50 px-4 py-2.5 text-blue-600 transition-colors hover:bg-blue-100"
                                    type="button"
                                >
                                    <Wallet className="h-4 w-4" />
                                    <span className="hidden text-sm font-semibold lg:inline">
                                        {selectedAccount
                                            ? `${(selectedAccount as { account_number?: string })?.account_number || 'Account'}`
                                            : 'No Account'}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {accountDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setAccountDropdownOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
                                            <div className="max-h-80 overflow-y-auto">
                                                {accounts.length > 0 ? (
                                                    accounts.map(
                                                        (account: unknown) => {
                                                            const acc =
                                                                account as {
                                                                    id: number;
                                                                    account_number: string;
                                                                    balance: number;
                                                                };

                                                            // Format balance
                                                            const formattedBalance = `₦${(acc.balance / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                                                            return (
                                                                <button
                                                                    key={acc.id}
                                                                    onClick={() => {
                                                                        setSelectedAccount(
                                                                            account as object,
                                                                        );
                                                                        setAccountDropdownOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className={cn(
                                                                        'w-full border-b border-gray-200 px-5 py-4 text-left transition-colors hover:bg-gray-50',
                                                                        (
                                                                            selectedAccount as {
                                                                                id: number;
                                                                            }
                                                                        )
                                                                            ?.id ===
                                                                        acc.id &&
                                                                        'border-l-4 border-l-blue-600 bg-blue-50',
                                                                    )}
                                                                    type="button"
                                                                >
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {
                                                                            acc.account_number
                                                                        }
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-gray-600">
                                                                        {
                                                                            formattedBalance
                                                                        }
                                                                    </p>
                                                                </button>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <div className="px-5 py-4 text-center text-sm text-gray-500">
                                                        No accounts found
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    href="/dashboard/accounts/add"
                                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Add New Account
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Notifications */}
                            <Link
                                href="/dashboard/notifications"
                                className="relative rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <Bell className="h-5 w-5" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-pink-500 text-[10px] font-bold text-white">
                                        {notificationCount > 99
                                            ? '99+'
                                            : notificationCount}
                                    </span>
                                )}
                            </Link>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen,
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-md border border-gray-300 p-1.5 transition-colors hover:bg-gray-50"
                                    type="button"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                                        <span className="text-xs font-semibold text-white">
                                            {userInitials}
                                        </span>
                                    </div>
                                    <ChevronDown className="hidden h-4 w-4 text-gray-600 sm:block" />
                                </button>

                                {profileDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setProfileDropdownOpen(false)
                                            }
                                        />
                                        <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
                                            <div className="rounded-t-lg border-b border-gray-200 bg-blue-50 px-5 py-4">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {userName}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    {userEmail}
                                                </p>
                                                {userPhone && (
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {userPhone}
                                                    </p>
                                                )}
                                                {(
                                                    auth?.user as {
                                                        referralId?: string;
                                                    }
                                                )?.referralId && (
                                                        <p className="mt-2 text-xs font-medium text-blue-600">
                                                            Referral ID:{' '}
                                                            {
                                                                (
                                                                    auth?.user as {
                                                                        referralId?: string;
                                                                    }
                                                                )?.referralId
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                            <Link
                                                href="/dashboard/settings"
                                                className="flex items-center gap-2 border-b border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {searchOpen && (
                        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
                            <div className="relative">
                                <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5">
                                    <Search className="h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search transactions, pages..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        onFocus={() =>
                                            searchQuery.length >= 2 &&
                                            setShowSearchDropdown(true)
                                        }
                                        className="w-full border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Mobile Search Results Dropdown */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                        {searchLoading && (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                Searching...
                                            </div>
                                        )}

                                        {!searchLoading &&
                                            searchResults.pages.length === 0 &&
                                            searchResults.transactions
                                                .length === 0 && (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    No results found
                                                </div>
                                            )}

                                        {/* Pages */}
                                        {!searchLoading &&
                                            searchResults.pages.length > 0 && (
                                                <>
                                                    <div className="border-b border-gray-200 px-4 py-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase">
                                                            Pages
                                                        </p>
                                                    </div>
                                                    {(
                                                        searchResults.pages as unknown[]
                                                    ).map(
                                                        (
                                                            page: unknown,
                                                            idx: number,
                                                        ) => {
                                                            const p = page as {
                                                                title: string;
                                                                url: string;
                                                            };
                                                            return (
                                                                <Link
                                                                    key={idx}
                                                                    href={p.url}
                                                                    onClick={() => {
                                                                        setShowSearchDropdown(
                                                                            false,
                                                                        );
                                                                        setSearchQuery(
                                                                            '',
                                                                        );
                                                                        setSearchOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className="block border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                                                >
                                                                    {p.title}
                                                                </Link>
                                                            );
                                                        },
                                                    )}
                                                </>
                                            )}

                                        {/* Transactions */}
                                        {!searchLoading &&
                                            searchResults.transactions.length >
                                            0 && (
                                                <>
                                                    <div className="border-b border-gray-200 px-4 py-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase">
                                                            Transactions
                                                        </p>
                                                    </div>
                                                    {(
                                                        searchResults.transactions as unknown[]
                                                    ).map(
                                                        (
                                                            txn: unknown,
                                                            idx: number,
                                                        ) => {
                                                            const t = txn as {
                                                                id: string;
                                                                title: string;
                                                                subtitle?: string;
                                                                amount?: string;
                                                                url?: string;
                                                            };
                                                            return (
                                                                <Link
                                                                    key={idx}
                                                                    href={
                                                                        t.url ||
                                                                        '/dashboard/transactions'
                                                                    }
                                                                    onClick={() => {
                                                                        setShowSearchDropdown(
                                                                            false,
                                                                        );
                                                                        setSearchQuery(
                                                                            '',
                                                                        );
                                                                        setSearchOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className="block border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                                                                >
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            t.title
                                                                        }
                                                                    </p>
                                                                    {t.subtitle && (
                                                                        <p className="text-xs text-gray-500">
                                                                            {
                                                                                t.subtitle
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </Link>
                                                            );
                                                        },
                                                    )}
                                                </>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <main className="container mx-auto min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export { DashboardLayout };
