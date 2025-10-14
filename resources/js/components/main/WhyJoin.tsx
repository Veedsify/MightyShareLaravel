import { Container } from '@/components/sub/Container';
import { FeatureCard } from '@/components/sub/FeatureCard';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import {
    Award,
    Clock,
    HandHeart,
    Shield,
    TrendingUp,
    Users,
} from 'lucide-react';

export const WhyJoin = () => {
    const reasons = [
        {
            icon: HandHeart,
            title: 'Community Support',
            description:
                'Join a caring community where members genuinely support each other through challenges and celebrations.',
        },
        {
            icon: Shield,
            title: 'Financial Security',
            description:
                'Build a safety net with emergency funds and savings that protect you and your family.',
        },
        {
            icon: TrendingUp,
            title: 'Wealth Building',
            description:
                'Grow your wealth through smart savings plans, returns on contributions, and financial education.',
        },
        {
            icon: Users,
            title: 'Network & Connect',
            description:
                'Build meaningful relationships with like-minded individuals who share your values and goals.',
        },
        {
            icon: Clock,
            title: 'Flexible Access',
            description:
                'Access your funds when you need them with transparent processes and quick turnaround times.',
        },
        {
            icon: Award,
            title: 'Member Benefits',
            description:
                'Enjoy exclusive perks, rewards, events, and opportunities reserved for MightyShare members.',
        },
    ];

    return (
        <Section id="why-join" className="relative overflow-hidden bg-blue-900">
            {/* Decorative Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Why Join MightyShare"
                    title="More Than Just a Foundation"
                    description="Discover the unique advantages of becoming a MightyShare member and how we're different from traditional charity organizations."
                    centered
                    className="text-white [&_.text-pink-500]:text-cyan-400 [&_p]:text-blue-100"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason) => (
                        <FeatureCard
                            key={reason.title}
                            icon={reason.icon}
                            title={reason.title}
                            description={reason.description}
                            className="border-cyan-400/20 bg-white/10 backdrop-blur-md hover:border-cyan-400/40 hover:bg-white/15 [&_div_div]:bg-white/10 [&_div_div]:hover:bg-white/20 [&_h3]:text-white [&_p]:text-blue-100 [&_svg]:text-cyan-400"
                        />
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid gap-8 rounded-2xl border border-cyan-400/20 bg-white/95 p-8 shadow-2xl shadow-cyan-400/10 backdrop-blur-sm md:grid-cols-4 md:p-12">
                    <div className="group text-center">
                        <p className="mb-2 text-5xl font-bold text-pink-500 transition-transform group-hover:scale-110">
                            10K+
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                            Active Members
                        </p>
                    </div>
                    <div className="group text-center">
                        <p className="mb-2 text-5xl font-bold text-cyan-400 transition-transform group-hover:scale-110">
                            $5M+
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                            Funds Distributed
                        </p>
                    </div>
                    <div className="group text-center">
                        <p className="mb-2 text-5xl font-bold text-blue-900 transition-transform group-hover:scale-110">
                            500+
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                            Families Helped
                        </p>
                    </div>
                    <div className="group text-center">
                        <p className="mb-2 text-5xl font-bold text-pink-500 transition-transform group-hover:scale-110">
                            95%
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                            Member Satisfaction
                        </p>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
