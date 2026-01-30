import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <img
                                src="/images/logo.jpg"
                                alt="MightyShare Logo"
                                className="h-12 w-12 rounded-full"
                            />
                            <span className="text-xl font-bold">
                                Mighty
                                <span className="text-pink-500">Share</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering communities through collective giving and
                            financial support. Together, we make a difference.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-pink-500"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-pink-500"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-pink-500"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-pink-500"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-pink-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#about"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#membership"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Membership
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#features"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Testimonials
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm text-muted-foreground transition-colors hover:text-pink-500"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    No 2 Ifoshi Road, Iyana Ejigbo, Inside
                                    Morouf Filling Station
                                    <br />
                                    Lagos, Nigeria
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    +234 810 420 8361 <br /> +234 913 762 3758
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    info@mightyshare.com <br />
                                    support@mightyshare.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} MightyShare. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
