import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2, Sun, Moon, Play } from 'lucide-react';
import CourtCard, { type Court } from './CourtCard';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import MyBookings from './MyBooking';
import { safeFetch } from '../../utils/safeFetch';
import AdminCourtTracker from './AdminCourtTracker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Time = {
    id: number;
    label: string;
    start_time: string; // "05:00:00"
};
type BookedSlot = {
    time_id: number;
    is_pending: boolean;
    user_id: number;
};
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const BookingSection = ({
    sectionRef,
}: {
    sectionRef: React.RefObject<HTMLDivElement>;
}) => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [times, setTimes] = useState<Time[]>([]);
    const [loading, setLoading] = useState(true);
    const { props } = usePage<any>();
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const today = new Date();
    const [startDate, setStartDate] = useState(today);

    const [selectedDate, setSelectedDate] = useState(formatDate(today));
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
    const [bookingStatus, setBookingStatus] = useState<
        'none' | 'pending' | 'confirmed'
    >('none');

    const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
    const [showMyBookings, setShowMyBookings] = useState(false);

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    const [mode, setMode] = useState<'day' | 'night' | 'open'>('day');
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

    const user = props.auth?.user;
    const isAdmin = Boolean(user?.is_admin);

    // Fetch courts
    useEffect(() => {
        fetch('/courts')
            .then((res) => res.json())
            .then((data) => {
                setCourts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Fetch times
    useEffect(() => {
        fetch('/bookings/time')
            .then((res) => res.json())
            .then((data) => setTimes(data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch booked slots for selected court/date
    // useEffect(() => {
    //     if (!selectedCourt || !selectedDate) return;

    //     fetch(
    //         `/bookings/slots?court_id=${selectedCourt.id}&date=${selectedDate}`,
    //     )
    //         .then((res) => res.json())
    //         .then((data) => setBookedSlots(data))
    //         .catch((err) => console.error(err));
    // }, [selectedCourt, selectedDate]);
    useEffect(() => {
        if (!selectedCourt || !selectedDate) return;

        fetch(
            `/bookings/slots?court_id=${selectedCourt.id}&date=${selectedDate}`,
        )
            .then((res) => res.json())
            .then((data: BookedSlot[]) => setBookedSlots(data))
            .catch((err) => console.error(err));
    }, [selectedCourt, selectedDate]);

    // Load pending booking from localStorage
    useEffect(() => {
        const user = props.auth?.user;

        if (!user) return;

        const stored = localStorage.getItem('pendingBooking');

        if (stored) {
            const { court, date, mode, times } = JSON.parse(stored);

            setSelectedCourt(court);
            setSelectedDate(date);
            setMode(mode as 'day' | 'night' | 'open');

            if (mode === 'open') {
                setSelectedTimes(times || []);
                setSelectedTime(null);
            } else {
                setSelectedTime(times?.[0] || null);
                setSelectedTimes([]);
            }

            console.log('Restored booking:', court, date, mode, times);

            localStorage.removeItem('pendingBooking');

            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });

            // Optionally show a toast
            // toast.success('Your selected booking was restored!');
        }
    }, [props.auth?.user]);

    const handleSelectCourt = (court: Court) => setSelectedCourt(court);

    const formatTime = (time: string) => {
        const [t, modifier] = time.split(' ');
        let [hours, minutes] = t.split(':');

        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);

        return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    const handleConfirm = async () => {
        if (!selectedCourt) return;

        // Validate time selection
        if (mode === 'open' && selectedTimes.length === 0) return;
        if (mode !== 'open' && !selectedTime) return;

        const user = props.auth?.user;
        if (!user) {
            // Store pending booking in localStorage
            localStorage.setItem(
                'pendingBooking',
                JSON.stringify({
                    court: selectedCourt,
                    date: selectedDate,
                    mode,
                    times: mode === 'open' ? selectedTimes : [selectedTime],
                }),
            );

            toast(
                'Please sign up or log in to confirm your reservation. Redirecting...',
                {
                    icon: '⚠️',
                    duration: 2500,
                    style: { background: '#f97316', color: 'white' },
                },
            );

            setTimeout(() => (window.location.href = '/auth'), 2500);
            return;
        }

        try {
            // Map selected labels to time IDs
            const timeIds = (mode === 'open' ? selectedTimes : [selectedTime])
                .map((label) => times.find((t) => t.label === label)?.id)
                .filter(Boolean);

            if (timeIds.length === 0) {
                toast.error('Invalid time selection.');
                return;
            }

            const payload = {
                court_id: selectedCourt.id,
                date: selectedDate,
                mode,
                time_ids: timeIds, // always send as array
            };

            const res = await safeFetch('/bookings', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(err);
                toast.error(err.message || 'Booking failed');
                return;
            }

            const data = await res.json();
            if (data.success) {
                setReferenceNumber(data.booking.reference_number);
                setBookingStatus(
                    data.booking.is_pending ? 'pending' : 'confirmed',
                );
            } else {
                toast.error('Booking failed!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong! Try refreshing the page.');
        }
    };

    const filterTimesByMode = (timeLabel: string) => {
        const [time, modifier] = timeLabel.split(' ');
        let [hour] = time.split(':').map(Number);

        if (modifier === 'PM' && hour !== 12) hour += 12;
        if (modifier === 'AM' && hour === 12) hour = 0;

        if (mode === 'day') return hour >= 5 && hour < 17;
        if (mode === 'night') return hour >= 17 && hour < 24;
        if (mode === 'open') return hour >= 20 && hour < 23;

        return true;
    };

    const handleDateChange = (date: Date | null) => {
        if (!date) return;
        setStartDate(date);
        setSelectedDate(formatDate(date)); // ensures server fetch uses local date
    };

    return (
        <section
            ref={sectionRef}
            className="flex justify-center bg-gradient-to-b from-[#f5f0e6] to-[#e8dfd0] py-20"
            id="booking"
        >
            <div className="container">
                {/* Header Section */}

                {isAdmin ? (
                    <AdminCourtTracker />
                ) : (
                    <>
                        {!showMyBookings && (
                            <motion.div
                                className="mb-1 text-center sm:mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-900 shadow-md backdrop-blur-lg hover:bg-green-500/20">
                                    <Calendar className="mr-1 inline h-4 w-4" />{' '}
                                    Reservations
                                </span>
                                <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                                    Book Your{' '}
                                    <span className="text-gradient">Court</span>
                                </h2>
                                <p className="mx-auto mt-3 max-w-md text-black">
                                    Select a court, pick your time, and confirm
                                    your booking.
                                </p>
                            </motion.div>
                        )}
                        <AnimatePresence mode="wait">
                            {/* My Bookings */}
                            {showMyBookings ? (
                                <MyBookings
                                    bookingStatus={bookingStatus}
                                    setBookingStatus={setBookingStatus}
                                />
                            ) : bookingStatus === 'pending' ? (
                                /* Pending Card */
                                <motion.div
                                    key="pending"
                                    className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-2xl"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 200,
                                            delay: 0.2,
                                        }}
                                        className="mb-6"
                                    >
                                        <CheckCircle2 className="mx-auto h-15 w-15 text-yellow-500 drop-shadow-md" />
                                    </motion.div>

                                    <h3 className="mb-4 font-sans text-3xl font-bold tracking-wide text-gray-900">
                                        Booking Pending
                                    </h3>
                                    <p className="mb-6 text-sm text-gray-700">
                                        Your reservation is successfully
                                        recorded.
                                        <br />
                                        Please wait for confirmation.
                                    </p>

                                    {/* Reservation Details */}
                                    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left shadow-sm">
                                        <h4 className="mb-4 text-center text-lg font-semibold text-gray-700">
                                            Reservation Details
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-start">
                                                <span className="font-medium text-gray-500">
                                                    Name:
                                                </span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {props.auth?.user?.name ||
                                                        props.auth?.user?.id ||
                                                        'Guest'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-start">
                                                <span className="font-medium text-gray-500">
                                                    Email:
                                                </span>
                                                <span className="ml-3 font-medium text-gray-900">
                                                    {props.auth?.user?.email ||
                                                        'N/A'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-start">
                                                <span className="font-medium text-gray-500">
                                                    Court:
                                                </span>
                                                <span className="ml-3 font-medium text-gray-900">
                                                    {selectedCourt?.name}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-start">
                                                <span className="font-medium text-gray-500">
                                                    Date:
                                                </span>
                                                <span className="ml-5 font-medium text-gray-900">
                                                    {selectedDate}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-start">
                                                <span className="font-medium text-gray-500">
                                                    Time:
                                                </span>
                                                <span className="ml-4 font-medium text-gray-900">
                                                    {selectedTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reference Number */}
                                    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                                        <p className="mb-2 text-sm text-gray-800">
                                            Booking Reference Number:
                                        </p>
                                        <div className="flex justify-center gap-2 text-center">
                                            <span
                                                className="cursor-pointer rounded bg-gray-100 px-3 py-2 font-mono text-lg text-gray-900 shadow-sm transition select-all hover:bg-gray-200"
                                                onClick={() => {
                                                    if (!referenceNumber)
                                                        return;
                                                    navigator.clipboard.writeText(
                                                        referenceNumber,
                                                    );
                                                    toast.success(
                                                        'Reference number copied!',
                                                    );
                                                }}
                                                title="Click to copy"
                                            >
                                                {referenceNumber}
                                            </span>
                                            <button
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-white shadow transition hover:bg-blue-700"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        referenceNumber || '',
                                                    );
                                                    toast.success(
                                                        'Reference number copied!',
                                                    );
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-700">
                                            Click My Bookings for confirmation
                                        </p>
                                    </div>

                                    <button
                                        className="w-full rounded-lg bg-gradient-to-r from-[#0e96b8] to-[#5acde7] py-3 font-semibold text-white shadow-lg transition-all hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                                        onClick={() => {
                                            setBookingStatus('none');
                                            setSelectedCourt(null);
                                            setSelectedTime(null);
                                        }}
                                    >
                                        Back to Courts
                                    </button>
                                </motion.div>
                            ) : !selectedCourt ? (
                                /* Courts List */
                                <motion.div
                                    key="courts"
                                    className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {loading ? (
                                        <p className="text-center text-black">
                                            Loading courts...
                                        </p>
                                    ) : (
                                        courts.map((court, i) => (
                                            <div
                                                key={court.id}
                                                className="p-2 sm:p-4"
                                            >
                                                <CourtCard
                                                    court={court}
                                                    index={i}
                                                    onSelect={handleSelectCourt}
                                                />
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="timeslots"
                                    className="mx-auto max-w-2xl px-8 sm:px-6 lg:px-8"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                >
                                    {/* Timeslots / Court Details Card */}
                                    <div className="glass-card rounded-xl bg-white p-6 shadow-lg sm:p-8">
                                        <h3 className="font-display mb-5 flex justify-center text-xl font-bold text-black">
                                            Court Details
                                        </h3>

                                        <h3 className="font-display mb-1 text-xl font-bold text-black">
                                            <span className="text-red-500">
                                                {selectedCourt.name}
                                            </span>
                                        </h3>
                                        <p className="mb-6 text-sm text-black">
                                            {selectedCourt.type} ·{' '}
                                            {selectedCourt.surface} surface
                                        </p>

                                        <div className="mb-6 w-full max-w-sm">
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                Select Date
                                            </label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleDateChange}
                                                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-500 px-4 py-2 text-sm font-bold text-gray-900 text-white transition hover:bg-white hover:text-black focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                                dateFormat="MMMM d, yyyy" // Display like "March 14"
                                                todayButton="Today"
                                                placeholderText="Select a date"
                                                minDate={new Date()} // <-- Restrict past dates
                                            />
                                        </div>
                                        <div className="mb-5 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setMode('day');
                                                    setSelectedTimes([]);
                                                    setSelectedTime(null);
                                                }}
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold sm:text-base md:text-lg lg:text-sm ${
                                                    mode === 'day'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-500 hover:bg-gray-700'
                                                }`}
                                            >
                                                <Sun size={20} />
                                                Day Time
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setMode('night');
                                                    setSelectedTimes([]);
                                                    setSelectedTime(null);
                                                }}
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold sm:text-base md:text-lg lg:text-sm ${
                                                    mode === 'night'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-500 hover:bg-gray-700'
                                                }`}
                                            >
                                                <Moon size={20} />
                                                Night Time
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setMode('open');
                                                    setSelectedTimes([]);
                                                    setSelectedTime(null);
                                                }}
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold sm:text-base md:text-lg lg:text-sm ${
                                                    mode === 'open'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-500 hover:bg-gray-700'
                                                }`}
                                            >
                                                <Play size={20} />
                                                Open Play
                                            </button>
                                        </div>
                                        <div>
                                            <label className="mb-3 block text-sm font-medium text-black">
                                                <Clock className="mr-1 inline h-4 w-4" />{' '}
                                                Available Times
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                                {times
                                                    .filter((slot) =>
                                                        filterTimesByMode(
                                                            slot.label,
                                                        ),
                                                    )
                                                    .map((slot) => {
                                                        const booking =
                                                            bookedSlots.find(
                                                                (b) =>
                                                                    b.time_id ===
                                                                    slot.id,
                                                            );

                                                        // Default slot values
                                                        let statusText =
                                                            'Available';
                                                        let statusColor =
                                                            'text-green-600';
                                                        let isDisabled = false;

                                                        if (booking) {
                                                            if (
                                                                booking.is_pending
                                                            ) {
                                                                // Pending booking
                                                                if (!user) {
                                                                    statusText =
                                                                        'Unavailable';
                                                                    statusColor =
                                                                        'text-gray-900';
                                                                    isDisabled = true;
                                                                } else if (
                                                                    user.id ===
                                                                    booking.user_id
                                                                ) {
                                                                    statusText =
                                                                        'Pending';
                                                                    statusColor =
                                                                        'text-yellow-500';
                                                                    isDisabled = true;
                                                                } else {
                                                                    statusText =
                                                                        'Unavailable';
                                                                    statusColor =
                                                                        'text-gray-900';
                                                                    isDisabled = true;
                                                                }
                                                            } else {
                                                                // Confirmed booking
                                                                if (
                                                                    user &&
                                                                    user.id ===
                                                                        booking.user_id
                                                                ) {
                                                                    statusText =
                                                                        'Confirmed';
                                                                    statusColor =
                                                                        'text-green-600';
                                                                    isDisabled = true;
                                                                } else {
                                                                    statusText =
                                                                        'Taken';
                                                                    statusColor =
                                                                        'text-red-500';
                                                                    isDisabled = true;
                                                                }
                                                            }
                                                        }

                                                        const isSelected =
                                                            mode === 'open'
                                                                ? selectedTimes.includes(
                                                                      slot.label,
                                                                  )
                                                                : selectedTime ===
                                                                  slot.label;

                                                        // If selected, override color to white
                                                        if (
                                                            !isDisabled &&
                                                            isSelected
                                                        ) {
                                                            statusColor =
                                                                'text-white';
                                                        }

                                                        // Determine if the label should be struck through
                                                        const isStrikethrough =
                                                            statusText ===
                                                                'Taken' &&
                                                            (!user ||
                                                                (user &&
                                                                    user.id !==
                                                                        booking?.user_id));

                                                        return (
                                                            <motion.button
                                                                key={slot.id}
                                                                disabled={
                                                                    isDisabled
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        isDisabled
                                                                    )
                                                                        return;
                                                                    if (
                                                                        mode ===
                                                                        'open'
                                                                    ) {
                                                                        setSelectedTimes(
                                                                            (
                                                                                prev,
                                                                            ) =>
                                                                                prev.includes(
                                                                                    slot.label,
                                                                                )
                                                                                    ? prev.filter(
                                                                                          (
                                                                                              t,
                                                                                          ) =>
                                                                                              t !==
                                                                                              slot.label,
                                                                                      )
                                                                                    : [
                                                                                          ...prev,
                                                                                          slot.label,
                                                                                      ],
                                                                        );
                                                                    } else {
                                                                        setSelectedTime(
                                                                            slot.label,
                                                                        );
                                                                    }
                                                                }}
                                                                className={`flex flex-col items-center justify-center rounded-lg border px-2 py-3 text-sm font-medium transition-all duration-200 sm:text-base md:text-lg lg:text-xl ${
                                                                    isDisabled
                                                                        ? 'cursor-not-allowed border-border bg-white text-red-500'
                                                                        : isSelected
                                                                          ? 'animate-pulse-glow border-transparent bg-blue-500 text-white shadow-lg'
                                                                          : 'cursor-pointer border-border bg-white text-black hover:border-black'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`font-semibold ${isStrikethrough ? 'line-through' : ''}`}
                                                                >
                                                                    {slot.label}
                                                                </span>
                                                                <span
                                                                    className={`text-xs ${statusColor}`}
                                                                >
                                                                    {statusText}
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
                                                    className={`w-full py-6 text-base text-white ${
                                                        mode === 'open'
                                                            ? 'bg-green-700 hover:bg-green-600'
                                                            : 'bg-gradient-to-r from-[#0e96b8] to-[#5acde7] hover:from-[#0c84a0] hover:to-[#4fc3e0]' // Day/Night
                                                    }`}
                                                    disabled={
                                                        mode === 'open'
                                                            ? selectedTimes.length ===
                                                              0
                                                            : !selectedTime
                                                    }
                                                    onClick={handleConfirm}
                                                >
                                                    <CheckCircle2 className="mr-2 h-5 w-5" />

                                                    {mode === 'open'
                                                        ? `Confirm Open Play (${selectedTimes.length} slots)`
                                                        : `Confirm Reservation — ${selectedTime || 'Select time'}`}
                                                </Button>

                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="w-full cursor-pointer bg-white py-6 text-black shadow-lg sm:flex-1"
                                                    onClick={() => {
                                                        setSelectedCourt(null);
                                                        setSelectedTime(null);
                                                        localStorage.removeItem(
                                                            'pendingBooking',
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                            <div className="mb-4 text-sm font-medium text-black">
                                {mode === 'day' && '₱300 per hour per court'}

                                {mode === 'night' && '₱350 per hour per court'}

                                {mode === 'open' && '₱200 per person'}
                            </div>
                        </AnimatePresence>
                    </>
                )}
            </div>
        </section>
    );
};

export default BookingSection;
