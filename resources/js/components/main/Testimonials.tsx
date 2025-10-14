import { Container } from '@/components/sub/Container';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import { TestimonialCard } from '@/components/sub/TestimonialCard';

export const Testimonials = () => {
    const testimonials = [
        {
            content:
                'MightyShare has been a blessing to my family. When I faced unexpected medical bills, the emergency fund helped me through the toughest time. The community support was incredible.',
            author: 'Sarah Johnson',
            role: 'Premium Member',
        },
        {
            content:
                "I've been able to save more than I ever thought possible with the thrift program. The returns are great, and I love being part of a community that genuinely cares.",
            author: 'Michael Chen',
            role: 'Basic Member',
        },
        {
            content:
                "As a family plan member, we feel secure knowing that all of us are covered. The financial advisory sessions have helped us plan for our children's education.",
            author: 'Aisha Ibrahim',
            role: 'Family Member',
        },
        {
            content:
                'The transparency and ease of use are unmatched. I can track every contribution and see exactly where my money goes. Trust is everything, and MightyShare has earned mine.',
            author: 'David Martinez',
            role: 'Premium Member',
        },
        {
            content:
                'What started as a simple membership has turned into lifelong friendships. The community events and networking opportunities have been invaluable to me.',
            author: 'Jennifer Williams',
            role: 'Basic Member',
        },
        {
            content:
                'MightyShare taught me financial discipline. The automated savings and educational resources have transformed how I think about money and my future.',
            author: 'Emmanuel Okafor',
            role: 'Premium Member',
        },
    ];

    return (
        <Section id="testimonials" className="relative bg-white">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-900/10 blur-3xl" />
                <div className="absolute top-1/4 right-20 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
                <div className="absolute bottom-40 left-1/4 h-80 w-80 rounded-full bg-pink-500/15 blur-3xl" />
                <div className="absolute right-10 bottom-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                {/* Subtle pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Member Stories"
                    title="What Our Members Say"
                    description="Hear from real members about their experiences and how MightyShare has made a difference in their lives."
                    centered
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            content={testimonial.content}
                            author={testimonial.author}
                            role={testimonial.role}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
};
