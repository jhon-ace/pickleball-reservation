import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Drop-In',
        price: '$8',
        period: 'per session',
        desc: 'Perfect for casual players who want to play when they feel like it.',
        features: [
            'Single court booking',
            'Standard hours (8AM–6PM)',
            'Online reservation',
            'Basic player profile',
        ],
        cta: 'Get Started',
        featured: false,
    },
    {
        name: 'Pro',
        price: '$49',
        period: 'per month',
        desc: 'For dedicated players who play multiple times a week.',
        features: [
            'Unlimited bookings',
            'Priority hours (6AM–10PM)',
            'Partner matching',
            'Player ratings & stats',
            'Guest passes (2/mo)',
        ],
        cta: 'Go Pro',
        featured: true,
    },
    {
        name: 'VIP',
        price: '$99',
        period: 'per month',
        desc: 'The ultimate experience for serious pickleball enthusiasts.',
        features: [
            'Everything in Pro',
            'Private court reservations',
            'Coaching session discounts',
            'Tournament entry included',
            'Unlimited guest passes',
            'Locker & towel service',
        ],
        cta: 'Join VIP',
        featured: false,
    },
];

const Pricing = () => (
    <section
        className="flex justify-center bg-gradient-to-b from-[#f5f0e6] to-[#e8dfd0]"
        id="pricing"
    >
        <div className="container mt-20 mb-20 sm:mt-20">
            <motion.div
                className="mb-14 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="mb-4 inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-medium text-white">
                    💰 Pricing
                </span>
                <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                    Simple, Fair{' '}
                    <span className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] bg-clip-text text-transparent">
                        Pricing
                    </span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-gray-500">
                    No hidden fees. Cancel anytime. Start playing today.
                </p>
            </motion.div>

            <div className="px-6 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            className={`flex flex-col rounded-xl p-6 transition-colors sm:p-8 ${
                                plan.featured
                                    ? 'relative border-transparent bg-gradient-to-r from-[#0e96b8] to-[#5acde7] text-white shadow-2xl'
                                    : 'border-transparent bg-white text-black shadow-md'
                            }`}
                            initial={plan.featured ? {} : { opacity: 0, y: 30 }}
                            whileInView={
                                plan.featured ? {} : { opacity: 1, y: 0 }
                            }
                            viewport={{ once: true }}
                            animate={
                                plan.featured
                                    ? { y: [0, -15, 0, -15, 0] }
                                    : undefined
                            }
                            transition={
                                plan.featured
                                    ? {
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                      }
                                    : { delay: i * 0.1 }
                            }
                            whileHover={{ y: plan.featured ? undefined : -5 }}
                        >
                            {plan.featured && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-4 py-1 text-xs font-bold text-black shadow">
                                    Most Popular
                                </span>
                            )}
                            <h3
                                className={`font-display mb-1 text-xl font-bold ${plan.featured ? '' : 'text-black'}`}
                            >
                                {plan.name}
                            </h3>
                            <p
                                className={`mb-5 text-sm ${plan.featured ? 'text-white' : 'text-black'}`}
                            >
                                {plan.desc}
                            </p>
                            <div className="mb-6">
                                <span className="font-display font-900 text-4xl">
                                    {plan.price}
                                </span>
                                <span
                                    className={`ml-1 text-sm ${plan.featured ? 'text-white' : 'text-black'}`}
                                >
                                    {plan.period}
                                </span>
                            </div>
                            <ul className="mb-8 flex-1 space-y-3">
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <Check
                                            className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-white' : 'text-black'}`}
                                        />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                size="lg"
                                className={`w-full cursor-pointer text-white ${
                                    plan.featured
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700'
                                        : 'bg-gradient-to-r from-[#0e96b8] to-[#5acde7] hover:from-[#0c84a0] hover:to-[#4fc3e0]'
                                }`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default Pricing;
