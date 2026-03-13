import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MyBookings from './MyBooking';

interface MyBookingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MyBookingsModal = ({ isOpen, onClose }: MyBookingsModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-white p-4 shadow-2xl sm:max-w-md sm:p-6 md:max-w-3xl md:p-8 lg:max-w-6xl">
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-3 rounded-full p-2 text-gray-700 hover:bg-gray-200 sm:top-4 sm:right-4"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>

                            {/* Scrollable Content */}
                            <div className="mt-2 overflow-y-auto">
                                <MyBookings
                                    bookingStatus="none"
                                    setBookingStatus={() => {}}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MyBookingsModal;
