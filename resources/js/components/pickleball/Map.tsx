import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Map = () => (
    <section
        className="flex justify-center bg-background bg-white py-20"
        id="location"
    >
        <div className="px-8 sm:px-6 lg:px-8">
            <div className="container">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-900 shadow-md backdrop-blur-lg hover:bg-green-500/20">
                        <MapPin className="mr-1 inline h-4 w-4" />
                        Location
                    </span>
                    <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                        Find{' '}
                        <span className="bg-gradient-to-r from-[#0e96b8] to-[#5acde7] bg-clip-text text-transparent">
                            Us
                        </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-black">
                        Experience top-notch pickleball courts built for
                        champions.
                    </p>
                </motion.div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
                    <motion.div
                        className="h-[350px] overflow-hidden rounded-xl border-1 border-gray-300 shadow-lg sm:h-[400px] lg:col-span-2"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <iframe
                            title="Picklora Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4762.753113444084!2d123.82642339401396!3d9.576447610718278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aa52dcffffffff%3A0x3f3ef9b1e76e3620!2sBohol%20Bee%20Farm!5e0!3m2!1sen!2sph!4v1772961298432!5m2!1sen!2sph"
                            className="h-full w-full"
                            loading="lazy"
                        ></iframe>
                    </motion.div>

                    <motion.div
                        className="flex flex-col justify-center gap-6 rounded-xl border-1 border-gray-200 bg-black bg-white p-6 shadow-lg sm:p-8"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h3 className="font-display mb-4 text-xl font-bold tracking-wider text-black">
                                Picklora Court
                            </h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                                    <span className="tracking-wider text-gray-500">
                                        Dao, Dauis, Bohol
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 shrink-0 text-gray-500" />
                                    <span className="tracking-wider text-gray-500">
                                        09173041491
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 shrink-0 text-gray-500" />
                                    <span className="tracking-wider text-gray-500">
                                        http://boholbeefarm.com/
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                                    <div className="tracking-wider text-gray-500">
                                        <p>Mon–Fri: 6AM – 10PM</p>
                                        <p>Sat–Sun: 7AM – 9PM</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

export default Map;
