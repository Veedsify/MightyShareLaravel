import { About } from '@/components/main/About';
import { Contact } from '@/components/main/Contact';
import { FeaturedMember } from '@/components/main/FeaturedMember';
import { Features } from '@/components/main/Features';
import { Footer } from '@/components/main/Footer';
import { Hero } from '@/components/main/Hero';
import { Membership } from '@/components/main/Membership';
import { Navbar } from '@/components/main/Navbar';
import { Testimonials } from '@/components/main/Testimonials';
import { WhyJoin } from '@/components/main/WhyJoin';
import { ScrollToTop } from '@/components/sub/ScrollToTop';
import { Head } from '@inertiajs/react';

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

interface HomeProps {
    thriftPackages: ThriftPackage[];
}

const Home = ({ thriftPackages }: HomeProps) => {
    return (
        <>
            <Head title="Mightyshare Charity Foundation" />
            <div className="min-h-screen">
                <Navbar />
                <main>
                    <Hero />
                    <About />
                    <Membership packages={thriftPackages} />
                    <Features />
                    <WhyJoin />
                    <Testimonials />
                    <FeaturedMember />
                    <Contact />
                </main>
                <Footer />
                <ScrollToTop />
            </div>
        </>
    );
};

export default Home;
