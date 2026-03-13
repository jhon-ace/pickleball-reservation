import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Court = { id: number; name: string };
type Time = { id: number; label: string; start_time: string };
type BookingSlot = { time_id: number; is_pending: number; user_id: number };
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export default function AdminCourtTracker() {
    const { props } = usePage<any>();
    const user = props.auth?.user;

    const [courts, setCourts] = useState<Court[]>([]);
    const [times, setTimes] = useState<Time[]>([]);
    const [bookings, setBookings] = useState<Record<number, BookingSlot[]>>({});
    const today = new Date();
    const [startDate, setStartDate] = useState(today);

    const [selectedDate, setSelectedDate] = useState(formatDate(today));

    // Fetch courts
    useEffect(() => {
        fetch('/courts')
            .then((res) => res.json())
            .then((data) => setCourts(data));
    }, []);

    // Fetch times
    useEffect(() => {
        fetch('/bookings/time')
            .then((res) => res.json())
            .then((data) => setTimes(data));
    }, []);

    // Fetch bookings per court
    // useEffect(() => {
    //     const fetchBookings = async () => {
    //         const result: Record<number, BookingSlot[]> = {};
    //         for (const court of courts) {
    //             const res = await fetch(
    //                 `/bookings/slots?court_id=${court.id}&date=${selectedDate}`,
    //             );
    //             const data = await res.json();
    //             result[court.id] = data.map((slot: any) => ({
    //                 time_id: slot.time_id,
    //                 is_pending: slot.is_pending,
    //                 user_id: slot.user_id,
    //             }));
    //         }
    //         setBookings(result);
    //     };
    //     if (courts.length) fetchBookings();
    // }, [courts, selectedDate]);

    useEffect(() => {
        const fetchBookings = async () => {
            const result: Record<number, BookingSlot[]> = {};
            for (const court of courts) {
                const res = await fetch(
                    `/bookings/slots?court_id=${court.id}&date=${selectedDate}`,
                );
                const data = await res.json();
                result[court.id] = data.map((slot: any) => ({
                    time_id: slot.time_id,
                    is_pending: slot.is_pending,
                    user_id: slot.user_id,
                }));
            }
            setBookings(result);
        };

        if (courts.length) fetchBookings();

        const interval = setInterval(() => {
            if (courts.length) fetchBookings();
        }, 1000); // fetch every 10 seconds

        return () => clearInterval(interval);
    }, [courts, selectedDate]);

    // Handle date change from react-datepicker
    const handleDateChange = (date: Date | null) => {
        if (!date) return;
        setStartDate(date);
        setSelectedDate(formatDate(date)); // ensures server fetch uses local date
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="mb-6 text-3xl font-bold text-black">
                Court Availability Tracker
            </h2>

            {/* Interactive Date Picker */}
            <div className="mb-6 w-full max-w-sm">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Select Date
                </label>
                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-500 px-4 py-2 text-sm font-bold text-gray-900 text-white transition hover:bg-white hover:text-black focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    dateFormat="MMMM d, YYYY" // <-- Display like "March 14"
                    todayButton="Today"
                    placeholderText="Select a date"
                />
            </div>

            {/* Courts Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {courts.map((court) => {
                    const courtBookings = bookings[court.id] || [];

                    return (
                        <div
                            key={court.id}
                            className="rounded-xl bg-white p-5 shadow"
                        >
                            <h3 className="mb-4 text-lg font-bold text-black">
                                {court.name}
                            </h3>

                            <div className="grid grid-cols-3 gap-2">
                                {times.map((time) => {
                                    const slot = courtBookings.find(
                                        (b) => b.time_id === time.id,
                                    );

                                    let statusText = 'Available';
                                    let statusColor = 'text-green-700';
                                    let bgColor = 'bg-green-100';
                                    let strikeThrough = false;

                                    if (slot) {
                                        if (slot.is_pending === 1) {
                                            // Pending booking
                                            statusText = 'Pending';
                                            statusColor = 'text-yellow-700';
                                            bgColor = 'bg-yellow-100';
                                            if (
                                                user &&
                                                user.id !== slot.user_id
                                            ) {
                                                strikeThrough = true;
                                            }
                                        } else {
                                            // Confirmed booking
                                            if (
                                                user &&
                                                user.id === slot.user_id
                                            ) {
                                                statusText = 'Confirmed';
                                                statusColor = 'text-green-600';
                                                bgColor = 'bg-green-100';
                                            } else {
                                                statusText = 'Taken';
                                                statusColor = 'text-red-500';
                                                bgColor = 'bg-red-100';
                                                strikeThrough = true;
                                            }
                                        }
                                    }

                                    return (
                                        <div
                                            key={time.id}
                                            className={`flex flex-col items-center justify-center rounded-lg px-2 py-3 text-sm font-medium ${bgColor} ${strikeThrough ? 'line-through' : ''}`}
                                        >
                                            <Clock className="mb-1 h-4 w-4" />
                                            {time.label}
                                            <span
                                                className={`text-xs ${statusColor}`}
                                            >
                                                {statusText}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
