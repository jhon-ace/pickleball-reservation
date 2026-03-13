import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Shield, Calendar } from 'lucide-react';
import { router, usePage, Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
interface NavbarProps {
    onBookNow: () => void;
    setShowModal: (val: boolean) => void; // Add this
    auth?: any; // Pass auth so it can check user
}

const Navbar = ({ onBookNow, setShowModal, auth }: NavbarProps) => {
    // const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const { props } = usePage<any>();
    const user = props.auth?.user;
    const isAdmin = Boolean(user?.is_admin);

    const handleSignOut = () => {
        router.post(
            '/logout',
            {},
            {
                preserveState: false,
                onSuccess: () => toast.success('Logged out successfully!'),
            },
        );
        setOpen(false);
    };

    const renderUserMenu = () => {
        if (!user) {
            return (
                <Link href="/auth">
                    <Button
                        className="cursor-pointer bg-background text-white hover:text-black"
                        size="sm"
                    >
                        <User className="mr-1 h-4 w-4" /> Sign In
                    </Button>
                </Link>
            );
        }

        return (
            <div className="flex items-center gap-3">
                {!isAdmin && (
                    <span className="flex items-center gap-1 font-medium text-black">
                        <User className="h-4 w-4" /> {user?.name ?? 'Guest'}
                    </span>
                )}

                {isAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit('/admin')}
                    >
                        <Shield className="mr-1 h-4 w-4" /> Admin
                    </Button>
                )}

                <Button
                    size="sm"
                    onClick={handleSignOut}
                    className="rounded-full p-2 text-black hover:underline"
                >
                    <LogOut className="h-6 w-6 text-black" />
                </Button>
            </div>
        );
    };

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-[#f5f0e6]/80 to-[#e8dfd0]/70 shadow-md backdrop-blur-lg">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex h-16 items-center justify-between py-4">
                    <a
                        href="/"
                        className="font-display flex flex-col items-start gap-1 text-foreground md:flex-row md:items-center md:gap-2"
                    >
                        <span className="text-gradient tracking-wider text-black sm:text-base md:text-lg lg:text-lg">
                            🏓 Picklora: Pickleball Court Reservation System
                        </span>
                    </a>

                    <div className="hidden items-center gap-6 md:flex">
                        <a
                            href="#booking"
                            className="text-sm text-black hover:underline"
                        >
                            Courts
                        </a>
                        <a
                            href="#features"
                            className="text-sm text-black hover:underline"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm text-black hover:underline"
                        >
                            Pricing
                        </a>

                        {!isAdmin && (
                            <Button
                                className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                                size="sm"
                                onClick={onBookNow}
                            >
                                Book Now
                            </Button>
                        )}
                        {props.auth?.user && (
                            <Button
                                size="sm"
                                onClick={() => setShowModal(true)}
                                className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                            >
                                My Bookings
                            </Button>
                        )}

                        {renderUserMenu()}
                    </div>

                    <button
                        className="p-2 text-black md:hidden"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="overflow-hidden rounded-b-md bg-white shadow-md md:hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: {
                                type: 'spring',
                                stiffness: 250,
                                damping: 25,
                            },
                            opacity: { duration: 0.2 },
                        }}
                    >
                        <div className="flex flex-col gap-4 px-4 py-6 text-center">
                            <a
                                href="#booking"
                                className="text-sm text-black hover:underline"
                            >
                                Courts
                            </a>
                            <a
                                href="#features"
                                className="text-sm text-black hover:underline"
                            >
                                Features
                            </a>
                            <a
                                href="#pricing"
                                className="text-sm text-black hover:underline"
                            >
                                Pricing
                            </a>

                            {!isAdmin && (
                                <Button
                                    className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                                    size="sm"
                                    onClick={onBookNow}
                                >
                                    Book Now
                                </Button>
                            )}
                            {props.auth?.user && (
                                <Button
                                    size="sm"
                                    onClick={() => setShowModal(true)}
                                    className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                                >
                                    My Bookings
                                </Button>
                            )}

                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() =>
                                                router.visit('/admin')
                                            }
                                        >
                                            <Shield className="mr-1 h-4 w-4" />{' '}
                                            Admin
                                        </Button>
                                    )}

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="mr-1 h-4 w-4" /> Sign
                                        Out
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex w-full justify-center"
                                    onClick={() => router.visit('/auth')}
                                >
                                    <User className="mr-1 h-4 w-4" /> Sign In
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/*  */}
        </nav>
    );
};

export default Navbar;
