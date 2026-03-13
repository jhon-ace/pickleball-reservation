import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Booking {
    id: number;
    court_name: string;
    date: string;
    time: string;
    is_pending: boolean;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface MyBookingsProps {
    bookingStatus: 'none' | 'pending' | 'confirmed';
    setBookingStatus: (status: 'none' | 'pending' | 'confirmed') => void;
}

const MyBookings = ({ bookingStatus, setBookingStatus }: MyBookingsProps) => {
    const { props } = usePage<any>();
    const user = props.auth?.user;
    const isAdmin = Boolean(user?.is_admin);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const fetchBookings = async (pageNumber: number = 1) => {
        setLoading(true);
        try {
            const res = await fetch(
                `/bookings/my-bookings?page=${pageNumber}`,
                {
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json' },
                },
            );
            const data = await res.json();
            setBookings(data.data || []);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                per_page: data.per_page,
                total: data.total,
                next_page_url: data.next_page_url,
                prev_page_url: data.prev_page_url,
            });
        } catch (err) {
            console.error(err);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(page);
    }, [page, bookingStatus]);

    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <motion.div
            key="mybookings"
            className="space-y-6 px-4 sm:px-6 lg:px-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
        >
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                    <span className="text-gradient bg-gradient-to-r from-[#0e96b8] to-[#5acde7] bg-clip-text text-transparent">
                        {isAdmin ? <>List of Bookings</> : <>My Bookings</>}
                    </span>
                </h2>
                <p className="mt-2 text-gray-600">
                    {isAdmin ? (
                        <>See list of pending, confirm, and cancel bookings.</>
                    ) : (
                        <>Review your court reservations and their status.</>
                    )}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-end gap-2">
                <label
                    htmlFor="sort"
                    className="text-sm font-medium text-gray-700"
                >
                    Sort by date:
                </label>
                <select
                    id="sort"
                    className="flex items-center gap-2 rounded-sm bg-gradient-to-r from-[#0e96b8] to-[#5acde7] p-2 px-2 py-2 text-white shadow-lg transition hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(e.target.value as 'asc' | 'desc')
                    }
                >
                    <option value="asc" className="text-black">
                        Oldest first
                    </option>
                    <option value="desc" className="text-black">
                        Newest first
                    </option>
                </select>
            </div>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : bookings.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                    No bookings yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedBookings.map((booking) => (
                        <motion.div
                            key={booking.id}
                            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-95 hover:text-black hover:shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Court Info */}
                            <h3 className="text-lg font-semibold text-gray-900">
                                {booking.court_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {booking.date} • {booking.time}
                            </p>

                            {/* Status Badge */}
                            <span
                                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition ${
                                    booking.is_pending
                                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                                        : 'bg-green-100 text-green-800 ring-1 ring-green-200'
                                }`}
                            >
                                {booking.is_pending ? 'Pending' : 'Confirmed'}
                            </span>

                            {/* Gradient hover overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/70 via-white/50 to-transparent opacity-0 transition-opacity hover:opacity-100"></div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0e96b8] to-[#5acde7] px-5 py-3 text-white shadow-lg transition hover:from-[#0c84a0] hover:to-[#4fc3e0] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={pagination.current_page === 1}
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 font-medium text-gray-700">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0e96b8] to-[#5acde7] px-5 py-3 text-white shadow-lg transition hover:from-[#0c84a0] hover:to-[#4fc3e0] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                            setPage((p) =>
                                Math.min(p + 1, pagination.last_page),
                            )
                        }
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default MyBookings;
