import { useRef } from 'react';
import Navbar from '../components/pickleball/Navbar';
// import HeroSection from '@/components/HeroSection';
// import BookingSection from '@/components/BookingSection';
// import FeaturesSection from '@/components/FeaturesSection';
// import PricingSection from '@/components/PricingSection';
// import Footer from '@/components/Footer';

const Index = () => {
    const bookingRef = useRef<HTMLDivElement>(null!);

    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onBookNow={scrollToBooking} />
            {/* <HeroSection onBookNow={scrollToBooking} />
            <BookingSection sectionRef={bookingRef} />
            <FeaturesSection />
            <PricingSection />
            <Footer /> */}
        </div>
    );
};

export default Index;
