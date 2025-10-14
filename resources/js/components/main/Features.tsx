import { Container } from '@/components/sub/Container';
import { FeatureCard } from '@/components/sub/FeatureCard';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import {
    ArrowDownUp,
    CreditCard,
    Lock,
    PiggyBank,
    TrendingUp,
    Wallet,
} from 'lucide-react';

export const Features = () => {
    const walletFeatures = [
        {
            icon: Wallet,
            title: 'Digital Wallet',
            description:
                'Manage all your contributions and savings in one secure digital wallet with real-time tracking.',
        },
        {
            icon: CreditCard,
            title: 'Easy Deposits',
            description:
                'Multiple payment options for seamless contributions, including bank transfers and cards.',
        },
        {
            icon: ArrowDownUp,
            title: 'Quick Withdrawals',
            description:
                'Fast and hassle-free withdrawal process when you need access to your funds.',
        },
    ];

    const thriftFeatures = [
        {
            icon: PiggyBank,
            title: 'Thrift Savings',
            description:
                'Build your savings systematically with our automated thrift program and earn returns.',
        },
        {
            icon: TrendingUp,
            title: 'Growth Plans',
            description:
                'Watch your savings grow with competitive interest rates and bonus incentives.',
        },
        {
            icon: Lock,
            title: 'Secure Deposits',
            description:
                'Your funds are protected with bank-level security and insurance coverage.',
        },
    ];

    return (
        <Section id="features" className="relative bg-white">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-20 right-1/4 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl" />
                <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-blue-900/15 blur-3xl" />
                <div className="absolute right-10 bottom-40 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Our Features"
                    title="Comprehensive Financial Tools"
                    description="Access powerful features designed to help you save, grow, and manage your finances effectively."
                    centered
                />

                {/* Wallet Features */}
                <div className="mb-20">
                    <h3 className="mb-8 text-center text-2xl font-bold">
                        Digital Wallet Features
                    </h3>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {walletFeatures.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Thrift Features */}
                <div>
                    <h3 className="mb-8 text-center text-2xl font-bold">
                        Thrift & Savings Features
                    </h3>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {thriftFeatures.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 rounded-2xl border border-cyan-400/20 bg-blue-900 p-8 text-center shadow-2xl shadow-blue-900/10 md:p-16">
                    <h3 className="mb-4 text-3xl font-bold text-white">
                        Ready to Take Control of Your Finances?
                    </h3>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Join thousands of members who are building their
                        financial future with MightyShare's powerful tools and
                        supportive community.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="/register"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-pink-600 px-10 text-sm font-medium text-white shadow-lg shadow-pink-600/30 transition-all hover:-translate-y-0.5 hover:bg-pink-700 hover:shadow-pink-600/40"
                        >
                            Start Your Journey
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex h-12 items-center justify-center rounded-md border-2 border-cyan-400/50 bg-white/10 px-10 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-cyan-400 hover:bg-white/20"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
