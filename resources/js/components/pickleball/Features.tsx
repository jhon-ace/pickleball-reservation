import { motion } from 'framer-motion';
import { Calendar, Zap, Users, Shield, Clock, Star } from 'lucide-react';

const features = [
    {
        icon: Calendar,
        title: 'Instant Booking',
        desc: 'Reserve a court in under 30 seconds with our streamlined system.',
    },
    {
        icon: Zap,
        title: 'Real-Time Availability',
        desc: 'See live court status so you never show up to a taken court.',
    },
    {
        icon: Users,
        title: 'Find Partners',
        desc: 'Match with players at your skill level in your area.',
    },
    {
        icon: Shield,
        title: 'Secure Payments',
        desc: 'Pay safely online — no cash, no hassle at the front desk.',
    },
    {
        icon: Clock,
        title: 'Flexible Scheduling',
        desc: 'Book recurring slots or drop in anytime from 6AM to 10PM.',
    },
    {
        icon: Star,
        title: 'Player Ratings',
        desc: 'Track your progress and see how you rank in the community.',
    },
];

const FeaturesSection = () => (
    <section className="flex justify-center bg-white py-20" id="features">
        <div className="container mb-10">
            <motion.div
                className="mb-14 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="mb-4 inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                    Why Picklora?
                </span>
                <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                    Everything You{' '}
                    <span className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] bg-clip-text text-transparent">
                        Need
                    </span>
                </h2>
            </motion.div>

            <div className="px-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            className="hover:border-skyblue-900 rounded-xl border border-green-500 bg-white p-6 shadow-lg"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="group-hover:animate-float mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-black">
                                <f.icon className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h3 className="font-display mb-2 text-lg font-bold text-black">
                                {f.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default FeaturesSection;
