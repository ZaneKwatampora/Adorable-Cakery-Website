import React from 'react';
import { Link } from 'react-router-dom';
import custom1 from '../assets/custom1.jpg';
import custom2 from '../assets/custom2.jpg';
import custom3 from '../assets/custom3.jpg';



export default function CustomCakes() {
    window.scrollTo(0, 0);
    const whatsappMessage = encodeURIComponent(
        "Hello! I’m interested in a custom cake. Here are some details:\n\n- Occasion:\n- Theme/Design:\n- Date needed:\n- Size or servings:\n\nLooking forward to hearing from you!"
    );

    const heroText = "Cakes made with love.";

    return (
        <main className="min-h-screen bg-pink-50 text-gray-800 flex flex-col items-center py-16 px-4 overflow-x-hidden">
            {/* ── BACK TO HOME BUTTON ── */}
            <div className="w-full max-w-6xl px-4 mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-all group overflow-hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        className="w-8 h-8 transition-transform group-hover:rotate-[360deg] duration-700 ease-in-out rolling-icon"
                    >
                        <path d="M32 2C15.43 2 2 15.43 2 32s13.43 30 30 30 30-13.43 30-30S48.57 2 32 2zm0 4c14.36 0 26 11.64 26 26S46.36 58 32 58 6 46.36 6 32 17.64 6 32 6zm0 10c-8.84 0-16 7.16-16 16 0 3.79 1.32 7.25 3.51 9.99.68.84 1.88.97 2.71.3s.97-1.88.3-2.71A11.948 11.948 0 0 1 20 32c0-6.62 5.38-12 12-12s12 5.38 12 12-5.38 12-12 12c-.38 0-.75-.02-1.12-.06a1.998 1.998 0 1 0-.38 3.97c.5.05 1.01.09 1.5.09 8.84 0 16-7.16 16-16s-7.16-16-16-16z" />
                    </svg>
                    <span className="text-sm back-text opacity-0 translate-x-[-10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                        Back Home
                    </span>
                </Link>
            </div>

            {/* ── ANIMATED HERO TEXT ── */}
            <p className="text-3xl md:text-4xl font-bold mb-10 flex flex-wrap justify-center space-x-1 shimmer-text">
                {heroText.split("").map((char, i) => (
                    <span
                        key={i}
                        className="animate-wave rainbow-letter"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </p>

            {/* ── POKER DEAL-IN CARD IMAGE SECTION ── */}
            <section className="flex flex-wrap justify-center gap-6 mb-14">
                {[custom1, custom2, custom3].map((img, index) => (
                    <div
                        key={index}
                        className="w-64 h-80 bg-white rounded-[1.25rem] shadow-xl overflow-hidden border-4 border-white animate-deal-in"
                        style={{
                            animationDelay: `${index * 0.3}s`,
                            animationFillMode: 'backwards',
                        }}
                    >
                        <img
                            src={img}
                            alt={`custom cake ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </section>

            {/* ── WHATSAPP CTA ── */}
            <section className="text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-3">
                    Want to bring your dream cake to life?
                </h2>
                <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                    Just send us a message on WhatsApp with your cake idea, theme, date, and size.
                    We’ll help you make it perfect!
                </p>
                <a
                    href={`https://wa.me/0722373231?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
                >
                    Contact us on WhatsApp
                </a>
            </section>

            {/* ── STYLES ── */}
            <style>{`
                @keyframes wave {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-10px);
                    }
                }
                .animate-wave {
                    display: inline-block;
                    animation: wave 1.8s ease-in-out forwards;
                }

                @keyframes deal-in {
                    0% {
                        transform: translateY(-50px) rotate(-5deg);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                }
                .animate-deal-in {
                    animation: deal-in 0.6s ease-out both;
                }

                .rolling-icon {
                    animation: rollIn 0.8s ease forwards;
                    transform-origin: center center;
                }
                @keyframes rollIn {
                    0% {
                        transform: rotate(0deg) scale(0.8);
                        opacity: 0.5;
                    }
                    50% {
                        transform: rotate(90deg) scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: rotate(0deg) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes shimmer {
                    0% { color: #ec4899; }
                    25% { color: #f472b6; }
                    50% { color: #fb7185; }
                    75% { color: #f9a8d4; }
                    100% { color: #ec4899; }
                }

                .rainbow-letter {
                    animation: shimmer 3s ease-in-out infinite;
                }
            `}</style>
        </main>
    );
}
