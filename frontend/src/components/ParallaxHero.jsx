import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import logo from '../assets/logo.png';
import sprinkles from '../assets/sprinkles.png';

export default function ParallaxHero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    // Stronger parallax transforms
    const yLogo = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const ySprinkles = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const yText = useTransform(scrollYProgress, [0, 1], [0, -120]);

    return (
        <section
            ref={ref}
            className="relative h-screen overflow-hidden flex items-center justify-center"
        >
            {/* Background sprinkles with strong parallax */}
            <motion.img
                src={sprinkles}
                alt="Sprinkles"
                style={{ y: ySprinkles }}
                className="absolute w-full h-full object-cover opacity-30 pointer-events-none z-0"
            />

            {/* Centered logo with strong parallax */}
            <motion.img
                src={logo}
                alt="Logo"
                style={{ y: yLogo }}
                className="w-36 md:w-48 z-20"
            />

            {/* Text */}
            <motion.div
                style={{ y: yText }}
                className="absolute bottom-10 text-center z-20"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-2">
                    Adorable Cakery
                </h1>
                <p className="text-lg font-NewYorkTimes flex space-x-1 pl-15">
                    {"Cakes made with love.".split("").map((char, i) => (
                        <span
                            key={i}
                            className="text-gray-700 animate-wave"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </p>
            </motion.div>
        </section>
    );
}
