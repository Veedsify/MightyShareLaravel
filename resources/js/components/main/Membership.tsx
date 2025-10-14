import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Container } from '@/components/sub/Container';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';

export const Membership = () => {
    const plans = [
        {
            name: 'Basic',
            price: '$10',
            period: 'month',
            description:
                'Perfect for individuals starting their journey with MightyShare.',
            features: [
                'Monthly contributions',
                'Access to emergency fund',
                'Community support network',
                'Basic financial resources',
                'Monthly newsletters',
            ],
            popular: false,
        },
        {
            name: 'Premium',
            price: '$25',
            period: 'month',
            description:
                'Ideal for members seeking enhanced benefits and priority access.',
            features: [
                'All Basic features',
                'Priority emergency fund access',
                'Thrift savings account',
                'Financial advisory sessions',
                'Exclusive member events',
                'Higher contribution returns',
            ],
            popular: true,
        },
        {
            name: 'Family',
            price: '$40',
            period: 'month',
            description:
                'Comprehensive coverage for your entire family unit.',
            features: [
                'All Premium features',
                'Cover up to 5 family members',
                'Family financial planning',
                'Educational workshops',
                'Legacy building support',
                'Premium support channel',
            ],
            popular: false,
        },
    ];

    return (
        <Section id="membership" className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <Container>
                <SectionHeading
                    subtitle="Membership Options"
                    title="Choose Your Path to Community Support"
                    description="Select a membership tier that fits your needs. All plans include access to our core community benefits."
                    centered
                    className="text-white [&_p]:text-blue-100 [&_.text-pink-500]:text-cyan-400"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={
                                plan.popular
                                    ? 'relative border-primary shadow-lg'
                                    : ''
                            }
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">
                                        {plan.price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        /{plan.period}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />
                                            <span className="text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={
                                        plan.popular ? 'default' : 'outline'
                                    }
                                    asChild
                                >
                                    <Link href="/register">Get Started</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
