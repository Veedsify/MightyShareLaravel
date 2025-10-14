import { Container } from '@/components/sub/Container';
import { Section } from '@/components/sub/Section';
import { SectionHeading } from '@/components/sub/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Section id="contact" className="bg-blue-900 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl" />
                <div className="absolute top-10 left-16 h-52 w-52 rounded-full bg-pink-500/30 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            </div>
            <Container>
                <SectionHeading
                    subtitle="Get In Touch"
                    title="Contact Us Today"
                    description="Have questions or ready to join? We're here to help. Reach out and let's start a conversation."
                    centered
                    className="text-white [&_.text-pink-500]:text-cyan-400 [&_p]:text-blue-100"
                />
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Contact Information */}
                    <div className="space-y-8 text-white">
                        <div>
                            <h3 className="mb-6 text-2xl font-bold">
                                Let's Connect
                            </h3>
                            <p className="text-blue-100">
                                Whether you're interested in membership, have
                                questions about our services, or want to learn
                                more about MightyShare, our team is ready to
                                assist you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 backdrop-blur-sm">
                                    <MapPin className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Visit Us
                                    </h4>
                                    <p className="text-sm text-blue-100">
                                        123 Charity Street
                                        <br />
                                        City, State 12345
                                        <br />
                                        United States
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 backdrop-blur-sm">
                                    <Phone className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Call Us
                                    </h4>
                                    <p className="text-sm text-blue-100">
                                        +1 (555) 123-4567
                                        <br />
                                        Mon-Fri: 9AM - 6PM EST
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 backdrop-blur-sm">
                                    <Mail className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="mb-1 font-semibold">
                                        Email Us
                                    </h4>
                                    <p className="text-sm text-blue-100">
                                        info@mightyshare.org
                                        <br />
                                        support@mightyshare.org
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-cyan-400/20 bg-white/10 p-6 backdrop-blur-sm">
                            <h4 className="mb-2 font-semibold">Office Hours</h4>
                            <div className="space-y-1 text-sm text-blue-100">
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-xl border border-cyan-400/20 bg-white/95 p-6 shadow-2xl backdrop-blur-sm md:p-8">
                        <h3 className="mb-6 text-2xl font-bold text-blue-900">
                            Send Us a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us how we can help you..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-pink-600 text-white shadow-lg shadow-pink-600/20 hover:bg-pink-700"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
