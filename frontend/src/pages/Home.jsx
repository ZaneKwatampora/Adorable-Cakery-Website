import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ParallaxHero from '../components/ParallaxHero';
import cakeImg from '../assets/cakes.jpg';
import cupcakesImg from '../assets/cupcakes.jpg';
import cookiesImg from '../assets/cookies.jpg';
import specialsImg from '../assets/specials.jpg';

const CATEGORY_DATA = {
    cake: {
        image: cakeImg,
        description: 'Delicious layered cakes for all occasions.',
    },
    cupcakes: {
        image: cupcakesImg,
        description: 'Sweet and colorful cupcakes, perfect for parties.',
    },
    cookies: {
        image: cookiesImg,
        description: 'Freshly baked cookies, crispy and soft.',
    },
    custom_cakes: {
        image: specialsImg,
        description: 'Want an extremely detailed cake? We got you!!',
    },
};

export default function Home() {
    const { user } = useContext(AuthContext);

    // Helper to format label from key
    const formatLabel = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <main className="text-gray-800 min-h-screen bg-gray-100">
            {/* ── HERO ─────────────────────── */}
            <ParallaxHero />

            {/* ── CATEGORY SELECTOR ───────────── */}
            <section className="bg-gray-100 py-16">
                <h2 className="text-2xl text-center font-bold pb-10">Browse by Category</h2>
                <div className="max-w-6xl mx-auto flex justify-center gap-8 flex-wrap">
                    {Object.entries(CATEGORY_DATA).map(([key, { image, description }]) => {
                        const isCustom = key === 'custom_cakes';
                        return (
                            <Link
                                to={isCustom ? "/custom-cakes" : `/category/${key}`}
                                key={key}
                                className="relative group w-48 h-64 sm:w-56 sm:h-72 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105"
                            >
                                <img src={image} alt={key} className="w-full h-full object-cover" />

                                <div className="absolute inset-0 flex flex-col justify-end">
                                    <div className="bg-black/60 text-white text-sm text-center px-3 py-2 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                        {description}
                                    </div>
                                    <p className="text-center font-semibold capitalize bg-white/90 py-1 text-black backdrop-blur-md">
                                        {formatLabel(key)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
