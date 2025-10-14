import { Container } from '@/components/sub/Container';
import { Button } from '@/components/ui/Button';
import { Link } from '@inertiajs/react';
import { ArrowRight, Users } from 'lucide-react';

export const Hero = () => {
    return (
        <section
            id="hero"
            className="relative overflow-hidden bg-blue-900 pt-16 md:pt-20"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            </div>
            <Container>
                <div className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-sm font-medium text-cyan-100">
                                Building Communities Together
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Empowering Lives Through{' '}
                            <span className="text-cyan-400">Collective</span>{' '}
                            Giving
                        </h1>
                        <p className="text-lg text-blue-100 md:text-xl">
                            Join MightyShare, a community-driven charity
                            foundation where members support each other through
                            contributions, savings, and shared prosperity.
                            Together, we build a stronger future.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-pink-600 text-white shadow-lg shadow-pink-600/20 hover:bg-pink-700"
                                asChild
                            >
                                <Link href="/register">
                                    Become a Member
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-cyan-400/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                                asChild
                            >
                                <a href="#about">Learn More</a>
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <div>
                                <p className="text-3xl font-bold text-cyan-400">
                                    10,000+
                                </p>
                                <p className="text-sm text-blue-200">
                                    Active Members
                                </p>
                            </div>
                            <div className="h-12 w-px bg-blue-700" />
                            <div>
                                <p className="text-3xl font-bold text-pink-500">
                                    $5M+
                                </p>
                                <p className="text-sm text-blue-200">
                                    Distributed
                                </p>
                            </div>
                            <div className="h-12 w-px bg-blue-700" />
                            <div>
                                <p className="text-3xl font-bold text-cyan-400">
                                    95%
                                </p>
                                <p className="text-sm text-blue-200">
                                    Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual */}
                    <div className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-cyan-400/20 bg-blue-800/50 shadow-2xl shadow-cyan-400/10 backdrop-blur-xl">
                            {/* Placeholder for image */}
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/20 backdrop-blur-sm">
                                        <Users className="h-12 w-12 text-cyan-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-white">
                                        Community Together
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-cyan-400/30 blur-xl" />
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-pink-500/30 blur-xl" />
                    </div>
                </div>
            </Container>
        </section>
    );
};
