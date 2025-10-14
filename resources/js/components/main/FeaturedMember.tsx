import { Container } from '@/components/sub/Container';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Link } from '@inertiajs/react';
import { Award, Star, TrendingUp } from 'lucide-react';

export const FeaturedMember = () => {
    return (
        <Section
            id="featured-member"
            className="relative overflow-hidden bg-slate-50"
        >
            {/* Decorative Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
                <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                {/* Subtle pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.01)_1px,transparent_1px),linear-gradient(225deg,rgba(0,0,0,.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Member Spotlight"
                    title="Featured Member of the Month"
                    description="Celebrating outstanding members who embody the spirit of MightyShare and inspire our community."
                    centered
                />
                <Card className="overflow-hidden border-cyan-400/20 shadow-2xl transition-shadow hover:shadow-cyan-400/10">
                    <div className="grid gap-0 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative bg-blue-900">
                            <div className="flex h-full min-h-[400px] items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-cyan-400 shadow-2xl ring-4 shadow-cyan-400/30 ring-blue-800">
                                        <span className="text-5xl font-bold text-blue-900">
                                            RK
                                        </span>
                                    </div>
                                    <Badge className="border-none bg-pink-500 text-white shadow-lg">
                                        <Award className="mr-1 h-3 w-3" />
                                        Member of the Month
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="flex flex-col justify-center bg-white p-8 md:p-12">
                            <h3 className="mb-2 text-3xl font-bold">
                                Rachel Kalu
                            </h3>
                            <p className="mb-6 text-lg text-muted-foreground">
                                Family Plan Member since 2022
                            </p>

                            <div className="mb-6 space-y-4">
                                <p className="leading-relaxed text-muted-foreground">
                                    Rachel has been an exemplary member,
                                    consistently supporting other members
                                    through mentorship and financial guidance.
                                    Her story of building a successful small
                                    business with help from MightyShare's
                                    resources has inspired many.
                                </p>
                                <p className="border-l-4 border-cyan-400 pl-4 leading-relaxed text-muted-foreground italic">
                                    "MightyShare gave me more than financial
                                    support—it gave me a community that believed
                                    in my dreams and helped me achieve them."
                                </p>
                            </div>

                            <div className="mb-8 grid grid-cols-3 gap-6">
                                <div className="rounded-xl border border-cyan-400/20 bg-slate-50 p-4 text-center shadow-sm transition-all hover:border-cyan-400/40 hover:shadow-md">
                                    <div className="mb-2 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-cyan-500" />
                                    </div>
                                    <p className="text-lg font-bold">$15K+</p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Savings
                                    </p>
                                </div>
                                <div className="rounded-xl border border-pink-400/20 bg-slate-50 p-4 text-center shadow-sm transition-all hover:border-pink-400/40 hover:shadow-md">
                                    <div className="mb-2 flex items-center justify-center">
                                        <Award className="h-6 w-6 text-pink-500" />
                                    </div>
                                    <p className="text-lg font-bold">25+</p>
                                    <p className="text-xs text-muted-foreground">
                                        Members Helped
                                    </p>
                                </div>
                                <div className="rounded-xl border border-blue-400/20 bg-slate-50 p-4 text-center shadow-sm transition-all hover:border-blue-400/40 hover:shadow-md">
                                    <div className="mb-2 flex items-center justify-center">
                                        <Star className="h-6 w-6 text-blue-900" />
                                    </div>
                                    <p className="text-lg font-bold">2+</p>
                                    <p className="text-xs text-muted-foreground">
                                        Years Active
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-pink-600 text-white shadow-lg shadow-pink-600/20 hover:bg-pink-700 md:w-auto"
                                asChild
                            >
                                <Link href="/register">Join Our Community</Link>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </Container>
        </Section>
    );
};
