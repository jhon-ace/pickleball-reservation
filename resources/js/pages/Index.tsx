// import { useRef, useState, useEffect } from 'react';
// import { usePage } from '@inertiajs/react';
// import Navbar from '../components/pickleball/Navbar';
// import HeroSection from '../components/pickleball/HeroSection';
// import BookingSection from '../components/pickleball/BookingSection';
// import Features from '../components/pickleball/Features';
// import Pricing from '../components/pickleball/Pricing';
// import Map from '../components/pickleball/Map';
// import Footer from '../components/pickleball/Footer';
// import toast, { Toaster } from 'react-hot-toast';

// const Index = () => {
//     const bookingRef = useRef<HTMLDivElement>(null!);
//     // const [showMyBookings, setShowMyBookings] = useState(false);
//     // const [bookingStatus, setBookingStatus] = useState<'none' | 'pending'>(
//     //     'none',
//     // );
//     // const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
//     const { flash } = usePage().props as any;

//     useEffect(() => {
//         if (flash?.success) toast.success(flash.success);
//         if (flash?.error) toast.error(flash.error);
//     }, [flash]);

//     const scrollToBooking = () => {
//         bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     return (
//         <div className="min-h-screen transition-colors duration-300">
//             <Navbar onBookNow={scrollToBooking} />
//             <HeroSection onBookNow={scrollToBooking} />
//             <BookingSection sectionRef={bookingRef} />
//             <Features />
//             <Pricing />
//             <Map />
//             <Footer />
//             <Toaster position="top-center" />
//         </div>
//     );
// };

// export default Index;

import { useRef, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../components/pickleball/Navbar';
import HeroSection from '../components/pickleball/HeroSection';
import BookingSection from '../components/pickleball/BookingSection';
import Features from '../components/pickleball/Features';
import Pricing from '../components/pickleball/Pricing';
import Map from '../components/pickleball/Map';
import Footer from '../components/pickleball/Footer';
import MyBookingsModal from '../components/pickleball/MyBookingsModal';
import toast, { Toaster } from 'react-hot-toast';

const Index = () => {
    const bookingRef = useRef<HTMLDivElement>(null!);
    const { flash, auth } = usePage().props as any;

    // Global modal state
    const [showBookingsModal, setShowBookingsModal] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen transition-colors duration-300">
            {/* Pass modal setter to Navbar */}
            <Navbar
                onBookNow={scrollToBooking}
                setShowModal={setShowBookingsModal}
                auth={auth}
            />

            <HeroSection onBookNow={scrollToBooking} />

            <BookingSection sectionRef={bookingRef} />

            <Features />
            <Pricing />
            <Map />
            <Footer />

            {/* Global MyBookingsModal */}
            {auth?.user && (
                <MyBookingsModal
                    isOpen={showBookingsModal}
                    onClose={() => setShowBookingsModal(false)}
                />
            )}

            <Toaster position="top-center" />
        </div>
    );
};

export default Index;
