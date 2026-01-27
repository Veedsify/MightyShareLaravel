import { Container } from '@/components/sub/Container';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';

interface ThriftPackage {
    id: number;
    name: string;
    price: number;
    duration: number;
    profitPercentage: number;
    description: string;
    terms: string;
    isActive: boolean;
    minContribution: number;
    maxContribution: number;
    features: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface MembershipProps {
    packages: ThriftPackage[];
}

export const Membership = ({ packages }: MembershipProps) => {
    // Format price to Naira currency
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Format duration from weeks to human-readable format
    const formatDuration = (weeks: number): string => {
        if (weeks >= 48) {
            return `${weeks / 48} year${weeks / 48 > 1 ? 's' : ''}`;
        } else if (weeks >= 4) {
            return `${weeks / 4} month${weeks / 4 > 1 ? 's' : ''}`;
        }
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    };

   

    return (
        <Section
            id="membership"
            className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Thrift Packages"
                    title="Choose Your Savings Plan"
                    description="Select a thrift package that fits your savings goals. All packages include access to our comprehensive thrift management system."
                    centered
                    className="text-white [&_.text-pink-500]:text-cyan-400 [&_p]:text-blue-100"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => {

                        return (
                            <Card
                                key={pkg.id}
                                className={'relative border-primary shadow-lg'}
                            >
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">
                                        {pkg.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {pkg.description}
                                    </CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">
                                            {formatPrice(pkg.price)}
                                        </span>
                                        <span className="text-muted-foreground">
                                            /{formatDuration(pkg.duration)}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {pkg.features.map((feature, index) => (
                                            <li
                                                key={index}
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
                                        variant={'default'}
                                        asChild
                                    >
                                        <Link
                                            href={`/register?package=${pkg.id}`}
                                        >
                                            Get Started
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
};
