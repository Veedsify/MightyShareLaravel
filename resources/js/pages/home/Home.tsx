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

const Home = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Membership />
                <Features />
                <WhyJoin />
                <Testimonials />
                <FeaturedMember />
                <Contact />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Home;
