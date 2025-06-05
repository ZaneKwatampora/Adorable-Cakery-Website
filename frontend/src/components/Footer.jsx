import { useEffect, useState } from 'react';

export default function Footer() {
    const [isMounted, setIsMounted] = useState(false);
    const year = new Date().getFullYear();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <footer
            className={`
        w-full bg-black text-gray-300 py-12 
        transition-colors duration-500
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ease-out duration-700
      `}
            aria-label="Site Footer"
        >
            <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3 rounded-t-lg">
                {/* Branding */}
                <div>
                    <h3 className="text-pink-500 text-lg font-bold mb-2">
                        Adorable Cakery
                    </h3>
                    <p className="text-sm">Nothing but happiness, love, and God.</p>
                </div>

                {/* Quick Links */}
                <nav aria-label="Quick Links">
                    <h4 className="text-pink-500 text-md font-semibold mb-3">
                        Quick Links
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a
                                href="/dashboard"
                                className="hover:text-pink-400 transition"
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href="/about"
                                className="hover:text-pink-400 transition"
                            >
                                About Us
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Contact & Socials */}
                <div>
                    <h4 className="text-md font-semibold mb-3 text-pink-500">
                        Contact
                    </h4>
                    <p className="text-sm mb-2 text-pink-600">
                        Email:{' '}
                        <a
                            href="mailto:hello@adorablecakery.com"
                            className="text-white hover:text-white transition"
                        >
                            adorable.thecakery@gmail.com
                        </a>
                    </p>
                    <p className="text-sm mb-2 text-pink-600">
                        WhatsApp:{' '}
                        <a
                            href="https://wa.me/0722373231"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-white transition"
                        >
                            Text us on WhatsApp
                        </a>
                    </p>

                    <div className="flex gap-6 mt-2 text-gray-400">
                        {/* Instagram */}
                        <a
                            href="https://instagram.com/adorablecakery"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 hover:bg-pink-600 transition-shadow shadow-md hover:shadow-pink-600"
                        >
                            <svg
                                className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M7.75 2C4.55 2 2 4.55 2 7.75v8.5C2 19.45 4.55 22 7.75 22h8.5c3.2 0 5.75-2.55 5.75-5.75v-8.5C22 4.55 19.45 2 16.25 2h-8.5zM12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5zm5.5-.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
                            </svg>
                            <span className="sr-only">Instagram</span>

                            {/* Tooltip */}
                            <span
                                aria-hidden="true"
                                className="absolute -top-8 px-2 py-1 rounded bg-pink-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none"
                            >
                                Instagram
                            </span>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:adorable.thecakery@gmail.com"
                            aria-label="Send Email"
                            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 hover:bg-red-600 transition-shadow shadow-md hover:shadow-red-600"
                        >
                            <svg
                                className="w-5 h-5 text-red-400 group-hover:text-white transition-colors"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M2.01 6.81a2.5 2.5 0 0 1 2.5-2.5h15a2.5 2.5 0 0 1 2.5 2.5v10.38a2.5 2.5 0 0 1-2.5 2.5h-15a2.5 2.5 0 0 1-2.5-2.5V6.81zm15.5-.38L12 11.69 6.5 6.43v-.04a.76.76 0 0 1 .04-.1l5.48 4.91a.5.5 0 0 0 .64 0l5.04-4.53z" />
                            </svg>
                            <span className="sr-only">Email</span>

                            {/* Tooltip */}
                            <span
                                aria-hidden="true"
                                className="absolute -top-8 px-2 py-1 rounded bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none"
                            >
                                Email
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="max-w-6xl mx-auto px-6 col-span-full text-center mt-12 text-gray-500 text-xs select-none">
                &copy; {year} Adorable Cakery. All rights reserved.
            </div>
        </footer>
    );
}
