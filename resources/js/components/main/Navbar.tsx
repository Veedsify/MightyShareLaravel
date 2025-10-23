import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavLink {
    label: string;
    href: string;
}

const navLinks: NavLink[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Membership', href: '#membership' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setIsScrolled(window.scrollY > 20);
        });
    }

    return (
        <nav
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300',
                isScrolled
                    ? 'border-b border-cyan-400/20 bg-white/95 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/90'
                    : 'bg-blue-900/80 backdrop-blur-sm',
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img
                            src="/images/logo.jpg"
                            alt="MightyShare Logo"
                            className="h-12 w-12 rounded-full"
                        />
                        <span
                            className={cn(
                                'text-xl font-bold transition-colors',
                                isScrolled ? 'text-blue-900' : 'text-white',
                            )}
                        >
                            Mighty
                            <span
                                className={cn(
                                    'transition-colors',
                                    isScrolled
                                        ? 'text-pink-500'
                                        : 'text-cyan-500',
                                )}
                            >
                                Share
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'group relative text-sm font-medium transition-colors',
                                    isScrolled
                                        ? 'text-gray-700 hover:text-blue-900'
                                        : 'text-blue-100 hover:text-white',
                                )}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan-400 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <Button
                            variant="ghost"
                            className={cn(
                                isScrolled
                                    ? 'text-blue-900 hover:bg-blue-900/10'
                                    : 'text-white hover:bg-white/10',
                            )}
                            asChild
                        >
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button
                            className="bg-pink-600 text-white shadow-lg shadow-pink-600/20 hover:bg-pink-700"
                            asChild
                        >
                            <Link href="/register">Join Now</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent md:hidden"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-t md:hidden">
                    <div className="space-y-1 px-4 pt-2 pb-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="flex flex-col space-y-2 pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button
                                className="bg-pink-600 text-white hover:bg-pink-700"
                                asChild
                            >
                                <Link href="/register">Join Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
