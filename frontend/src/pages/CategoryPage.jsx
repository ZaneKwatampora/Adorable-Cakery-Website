import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchProducts()
            .then((data) => {
                const filtered = category === 'specials'
                    ? data.filter((item) => item.is_special)
                    : data.filter((item) =>
                        item.category?.name?.toLowerCase() === category.toLowerCase()
                    );
                setProducts(filtered);
            })
            .catch(console.error);
    }, [category]);

    return (
        <main className="min-h-screen py-10 px-4 bg-white text-gray-800">
            {/* Cinnamon Roll Home Button with extra top margin */}
            <div className="max-w-6xl mx-auto mb-6 mt-10">
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

                <h1 className="text-2xl font-bold capitalize mt-4">{category} Treats</h1>
            </div>

            {/* Product Grid */}
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((item) => <ProductCard key={item.id} item={item} />)
                ) : (
                    <p className="col-span-full text-center text-gray-500">No products found in this category.</p>
                )}
            </div>

            <style>{`
                    /* Rolling icon initial shape animation */
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
                    /* The text fades and slides in on hover via Tailwind classes */
                `}</style>
        </main>
    );
}
