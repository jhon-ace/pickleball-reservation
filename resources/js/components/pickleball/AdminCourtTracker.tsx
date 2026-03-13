import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

type Court = {
    id: number;
    name: string;
};

type Time = {
    id: number;
    label: string;
    start_time: string; // "HH:MM"
};

type BookingSlot = {
    time: string; // "HH:MM:SS"
    is_pending: number; // 0 = booked, 1 = pending
};

export default function AdminCourtTracker() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [times, setTimes] = useState<Time[]>([]);
    const [bookings, setBookings] = useState<Record<number, BookingSlot[]>>({});
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString('en-CA'),
    );

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
    useEffect(() => {
        const fetchBookings = async () => {
            const result: Record<number, BookingSlot[]> = {};
            for (const court of courts) {
                const res = await fetch(
                    `/bookings/slots?court_id=${court.id}&date=${selectedDate}`,
                );
                const data = await res.json();
                // Store as array of objects with time and is_pending
                result[court.id] = data.map((slot: any) => ({
                    time: slot.time, // "HH:MM:SS"
                    is_pending: slot.is_pending ?? 0, // default 0 if missing
                }));
            }
            setBookings(result);
        };

        if (courts.length) fetchBookings();
    }, [courts, selectedDate]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="mb-6 text-3xl font-bold text-black">
                Court Availability Tracker
            </h2>

            {/* Date Picker */}
            <div className="mb-6">
                <label className="mr-2 text-sm font-medium text-black">
                    Select Date
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border px-3 py-2"
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
                                    // Compare only HH:MM
                                    const slot = courtBookings.find(
                                        (b) =>
                                            b.time?.slice(0, 5) ===
                                            time.start_time.slice(0, 5),
                                    );

                                    const isPending = slot?.is_pending === 1;
                                    const isTaken = slot?.is_pending === 0;

                                    return (
                                        <div
                                            key={time.id}
                                            className={`flex flex-col items-center justify-center rounded-lg px-2 py-3 text-sm font-medium ${
                                                isPending
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : isTaken
                                                      ? 'bg-red-100 text-red-600'
                                                      : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            <Clock className="mb-1 h-4 w-4" />
                                            {time.label}
                                            <span className="text-xs">
                                                {isPending
                                                    ? 'Pending'
                                                    : isTaken
                                                      ? 'Taken'
                                                      : 'Available'}
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
