import { useRef, useState, useEffect } from 'react';
import Navbar from '../components/pickleball/Navbar';
import HeroSection from '../components/pickleball/HeroSection';
import BookingSection from '../components/pickleball/BookingSection';
import Features from '../components/pickleball/Features';
import Pricing from '../components/pickleball/Pricing';
import Map from '../components/pickleball/Map';
import Footer from '../components/pickleball/Footer';

const Index = () => {
    const bookingRef = useRef<HTMLDivElement>(null!);
    const [darkMode, setDarkMode] = useState(false);

    // useEffect(() => {
    //     const savedMode = localStorage.getItem('darkMode');
    //     if (savedMode) setDarkMode(savedMode === 'true');
    // }, []);

    // useEffect(() => {
    //     if (darkMode) {
    //         document.documentElement.classList.add('dark');
    //     } else {
    //         document.documentElement.classList.remove('dark');
    //     }
    //     localStorage.setItem('darkMode', darkMode.toString());
    // }, [darkMode]);

    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Navbar
                onBookNow={scrollToBooking}
                // darkMode={darkMode}
                // setDarkMode={setDarkMode}
            />
            <HeroSection onBookNow={scrollToBooking} />
            <BookingSection sectionRef={bookingRef} />
            <Features />
            <Pricing />
            <Map />
            <Footer />
        </div>
    );
};

export default Index;
