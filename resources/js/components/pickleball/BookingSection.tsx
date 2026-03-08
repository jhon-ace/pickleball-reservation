import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';
import CourtCard, { type Court } from './CourtCard';
import heroImage from '../../../../public/assets/img/hero-courts.jpg';

const courts: Court[] = [
    {
        id: 1,
        name: 'Court A — Championship',
        type: 'indoor',
        surface: 'Cushioned',
        available: true,
        image: heroImage,
    },
    {
        id: 2,
        name: 'Court B — Pro',
        type: 'indoor',
        surface: 'Cushioned',
        available: true,
        image: heroImage,
    },
    {
        id: 3,
        name: 'Court C — Garden',
        type: 'outdoor',
        surface: 'Concrete',
        available: true,
        image: heroImage,
    },
    {
        id: 4,
        name: 'Court D — Sunset',
        type: 'outdoor',
        surface: 'Asphalt',
        available: false,
        image: heroImage,
    },
    {
        id: 5,
        name: 'Court E — Baseline',
        type: 'indoor',
        surface: 'Sport Court',
        available: true,
        image: heroImage,
    },
    {
        id: 6,
        name: 'Court F — Rally',
        type: 'outdoor',
        surface: 'Concrete',
        available: true,
        image: heroImage,
    },
];

const timeSlots = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
];

const bookedSlots = ['9:00 AM', '2:00 PM', '6:00 PM'];

const BookingSection = ({
    sectionRef,
}: {
    sectionRef: React.RefObject<HTMLDivElement>;
}) => {
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const handleSelectCourt = (court: Court) => {
        setSelectedCourt(court);
    };

    const handleConfirm = () => {
        if (!selectedCourt || !selectedTime) return;

        setConfirmed(true);
        setTimeout(() => {
            setConfirmed(false);
            setSelectedCourt(null);
            setSelectedTime(null);
        }, 3000);
    };

    return (
        <section
            ref={sectionRef}
            className="flex justify-center bg-gradient-to-b from-[#f5f0e6] to-[#e8dfd0] py-20"
            id="booking"
        >
            <div className="container">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-900 shadow-md backdrop-blur-lg hover:bg-green-500/20">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        Reservations
                    </span>
                    <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                        Book Your <span className="text-gradient">Court</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-black">
                        Select a court, pick your time, and confirm your
                        booking.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {confirmed ? (
                        <motion.div
                            key="confirmed"
                            className="mx-auto max-w-md py-16 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    delay: 0.2,
                                }}
                            >
                                <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />
                            </motion.div>
                            <h3 className="font-display mb-2 text-2xl font-bold text-black">
                                Booking Confirmed!
                            </h3>
                            <p className="text-black">
                                {selectedCourt?.name} — {selectedDate} at{' '}
                                {selectedTime}
                            </p>
                        </motion.div>
                    ) : !selectedCourt ? (
                        <motion.div
                            key="courts"
                            className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {courts.map((court, i) => (
                                <div key={court.id} className="p-2 sm:p-4">
                                    {' '}
                                    {/* padding inside each card */}
                                    <CourtCard
                                        court={court}
                                        index={i}
                                        onSelect={handleSelectCourt}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeslots"
                            className="mx-auto max-w-2xl px-8 sm:px-6 lg:px-8"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                        >
                            <div className="glass-card rounded-xl bg-white p-6 shadow-lg sm:p-8">
                                <h3 className="font-display mb-5 flex justify-start text-xl font-bold text-black">
                                    Court Details
                                </h3>
                                <h3 className="font-display mb-1 text-xl font-bold text-black">
                                    {selectedCourt.name}
                                </h3>
                                <p className="mb-6 text-sm text-black">
                                    {selectedCourt.type} ·{' '}
                                    {selectedCourt.surface} surface
                                </p>

                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-black">
                                        Choose Date
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) =>
                                                setSelectedDate(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                e.preventDefault()
                                            } // prevent typing
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            className="ml-3 w-1/2 cursor-pointer rounded-lg bg-gradient-to-r from-[#0e96b8] to-[#5acde7] px-2 py-2 text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black">
                                        <Clock className="mr-1 inline h-4 w-4" />{' '}
                                        Available Times
                                    </label>
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                        {timeSlots.map((slot) => {
                                            const isBooked =
                                                bookedSlots.includes(slot);
                                            const isSelected =
                                                selectedTime === slot;

                                            return (
                                                <motion.button
                                                    key={slot}
                                                    whileHover={
                                                        !isBooked
                                                            ? { scale: 1.05 }
                                                            : {}
                                                    }
                                                    whileTap={
                                                        !isBooked
                                                            ? { scale: 0.95 }
                                                            : {}
                                                    }
                                                    disabled={isBooked}
                                                    onClick={() =>
                                                        setSelectedTime(slot)
                                                    }
                                                    className={`flex flex-col items-center justify-center rounded-lg border px-2 py-3 text-sm font-medium transition-all duration-200 ${
                                                        isBooked
                                                            ? 'cursor-not-allowed border-border bg-white text-red-500'
                                                            : isSelected
                                                              ? 'animate-pulse-glow border-transparent bg-blue-500 text-white shadow-lg'
                                                              : 'cursor-pointer border-border bg-black/30 bg-white text-black backdrop-blur-sm hover:border-black hover:text-black'
                                                    }`}
                                                >
                                                    {/* Time */}
                                                    <span
                                                        className={`font-semibold ${
                                                            isBooked
                                                                ? 'line-through'
                                                                : ''
                                                        }`}
                                                    >
                                                        {slot}
                                                    </span>

                                                    {/* Status */}
                                                    <span
                                                        className={`text-xs ${
                                                            isBooked
                                                                ? 'text-red-500'
                                                                : isSelected
                                                                  ? 'text-white'
                                                                  : 'text-green-600'
                                                        }`}
                                                    >
                                                        {isBooked
                                                            ? 'Taken'
                                                            : 'Available'}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <motion.div
                                    className="mt-8"
                                    initial={false}
                                    animate={{
                                        opacity: selectedTime ? 1 : 0.5,
                                    }}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                        <Button
                                            size="lg"
                                            className="w-full cursor-pointer bg-gradient-to-r from-[#0e96b8] to-[#5acde7] py-6 text-base text-white hover:from-[#0c84a0] hover:to-[#4fc3e0] sm:flex-1"
                                            disabled={!selectedTime}
                                            onClick={handleConfirm}
                                        >
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            {`Confirm Reservation — ${selectedTime || 'Select a time'}`}
                                        </Button>

                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full cursor-pointer bg-white py-6 text-black shadow-lg sm:flex-1"
                                            onClick={() => {
                                                setSelectedCourt(null);
                                                setSelectedTime(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default BookingSection;
