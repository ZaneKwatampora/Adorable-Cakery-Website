import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

const FLAVOURS = ['all', 'classic', 'chocolate', 'fruity', 'special'];

export default function CakePage() {
    const [selectedFlavour, setSelectedFlavour] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                let query = {};

                if (selectedFlavour === 'all') {
                    query = { category: 'cakes' };
                } else if (selectedFlavour === 'special') {
                    query = { category: 'cakes', is_special: true };
                } else {
                    query = { category: 'cakes', flavour: selectedFlavour };
                }

                const data = await fetchProducts(query);
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [selectedFlavour]);

    return (
        <div className="min-h-screen bg-pink-50 py-10 px-4">
            <h1 className="text-4xl font-bold text-center text-pink-700 mb-2">
                Our Signature Cakes
            </h1>
            <p className="text-center text-lg text-gray-600 mb-10">
                Explore the delicious world of cakes by flavour!
            </p>

            {/* ─── FLAVOUR SELECTOR (Centered) ─── */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
                {FLAVOURS.map((flavour) => (
                    <button
                        key={flavour}
                        onClick={() => setSelectedFlavour(flavour)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-300 ${
                            selectedFlavour === flavour
                                ? 'bg-pink-600 text-white shadow-lg scale-105'
                                : 'bg-white text-pink-600 border border-pink-300 hover:bg-pink-100'
                        }`}
                    >
                        {flavour.charAt(0).toUpperCase() + flavour.slice(1)}
                    </button>
                ))}
            </div>

            {/* ─── PRODUCT GRID ─── */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <p className="text-center text-gray-500 text-lg">Loading cakes...</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No cakes found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
