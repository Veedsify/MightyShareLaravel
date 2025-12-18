import { Container } from '@/components/sub/Container';
import { FeatureCard } from '@/components/sub/FeatureCard';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import { CheckCircle, Heart, Shield, Users } from 'lucide-react';

export const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Community First',
            description:
                'We believe in the power of community and collective support to create lasting change.',
        },
        {
            icon: Shield,
            title: 'Trust & Transparency',
            description:
                'Every transaction is transparent, and member funds are securely managed and protected.',
        },
        {
            icon: Users,
            title: 'Inclusive Growth',
            description:
                'We welcome everyone and create opportunities for all members to thrive together.',
        },
        {
            icon: CheckCircle,
            title: 'Proven Impact',
            description:
                'Our track record shows consistent positive outcomes for thousands of members.',
        },
    ];

    return (
        <Section id="about" className="relative overflow-hidden bg-slate-50">
            {/* Decorative Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-20 -left-40 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
                {/* Subtle diagonal pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.01)_1px,transparent_1px),linear-gradient(225deg,rgba(0,0,0,.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Content */}
                    <div className="space-y-6">
                        <SectionHeading
                            subtitle="About MightyShare"
                            title="Building a Foundation of Trust and Support"
                            description="MightyShare is more than just a charity foundation—we're a community committed to lifting each other up through shared resources, mutual support, and collective prosperity."
                        />
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500 shadow-md shadow-pink-500/20">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Member-Driven Contributions
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Every member contributes and benefits
                                        from our collective fund, ensuring
                                        equitable support for all.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 shadow-md shadow-cyan-400/20">
                                    <CheckCircle className="h-5 w-5 text-blue-900" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Financial Empowerment
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Access to savings
                                        plans, and thrift services that help you
                                        build financial security.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-900 shadow-md shadow-blue-900/20">
                                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Transparent Operations
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Track your contributions, view fund
                                        allocations, and see the real impact of
                                        your participation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div>
                        <h3 className="mb-8 text-2xl font-bold">
                            Our Core Values
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {values.map((value) => (
                                <FeatureCard
                                    key={value.title}
                                    icon={value.icon}
                                    title={value.title}
                                    description={value.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
