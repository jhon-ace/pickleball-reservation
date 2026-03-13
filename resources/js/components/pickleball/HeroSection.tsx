import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import heroImage from '../../../../public/assets/img/hero-courts.jpg';

const HeroSection = ({ onBookNow }: { onBookNow: () => void }) => {
    const [courtCount, setCourtCount] = useState(0);

    useEffect(() => {
        fetch('/courts/count')
            .then((res) => res.json())
            .then((data) => setCourtCount(data.count))
            .catch((err) => console.error(err));
    }, []);

    return (
        <section className="relative flex min-h-[100vh] items-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={heroImage}
                    alt="Pickleball courts at golden hour"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto mt-1 ml-2 flex max-w-7xl justify-start px-8 py-10 sm:mt-2 md:ml-30 lg:mt-10 lg:ml-62">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="mt-10 inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-medium text-black">
                            🏓 Book Your Court Today
                        </span>
                    </motion.div>

                    <motion.h1
                        className="font-display font-900 mb-6 text-4xl font-bold tracking-wider sm:text-5xl md:text-6xl"
                        style={{ color: 'hsl(var(--primary-foreground))' }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <br />
                        <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-green-500 bg-clip-text text-4xl font-bold tracking-wider text-transparent sm:text-5xl md:text-6xl">
                            Your Court.
                            <br />
                            Your Time.
                            <br />
                            Your Game.
                        </span>
                    </motion.h1>

                    <motion.p
                        className="mb-8 text-lg leading-relaxed tracking-wider sm:text-xl"
                        style={{ color: 'white' }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Seamless booking for the ultimate pickleball experience,
                        where premium courts, flexible scheduling, and a
                        welcoming community of players come together for every
                        match you play.
                    </motion.p>

                    <motion.div
                        className="flex flex-col gap-4 sm:flex-row"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                    >
                        <Button
                            size="lg"
                            className="cursor-pointer bg-gradient-to-r from-[#0e96b8] to-[#5acde7] px-8 py-6 text-base text-white hover:from-[#0c84a0] hover:to-[#4fc3e0]"
                            onClick={onBookNow}
                        >
                            <Calendar className="mr-2 h-5 w-5" />
                            Book Now
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="cursor-pointer rounded-lg border border-white bg-white/8 px-8 py-6 text-base text-white backdrop-blur-sm hover:bg-white/20"
                            onClick={onBookNow}
                        >
                            <MapPin className="mr-2 h-5 w-5" />
                            View Courts
                        </Button>
                    </motion.div>

                    <motion.div
                        className="mt-12 flex flex-wrap gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        {[
                            {
                                icon: MapPin,
                                label: `${courtCount} Courts`,
                                sub: 'Indoor & Outdoor',
                            },
                            {
                                icon: Clock,
                                label: '5 AM – 12AM',
                                sub: 'Daily Hours',
                            },
                            {
                                icon: Calendar,
                                label: 'Easy Booking',
                                sub: 'Reserve in seconds',
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#0e96b8] to-[#5acde7]">
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {item.label}
                                    </p>
                                    <p
                                        className="text-xs"
                                        style={{ color: 'hsl(0 0% 70%)' }}
                                    >
                                        {item.sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
