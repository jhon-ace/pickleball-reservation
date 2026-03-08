const Footer = () => (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-[#f5f0e6] to-[#e8dfd0] py-12">
        <div className="px-6 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                    {/* Left */}
                    <p className="font-display text-lg font-bold tracking-wider text-black">
                        🏓 Picklora
                    </p>

                    {/* Center */}
                    <p className="bg-clip-text text-sm text-[#0e96b8]">
                        © 2026 Picklora. All rights reserved.
                    </p>

                    {/* Right */}
                    <div className="flex gap-6 text-sm text-[#0e96b8]">
                        <a
                            href="#"
                            className="transition-colors hover:text-foreground"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-foreground"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-foreground"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
