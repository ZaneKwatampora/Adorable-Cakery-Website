import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProducts('all').then(setItems).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-pink-600 tracking-wide">
        All Our Treats
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 ? (
          items.map((p) => (
            <div
              key={p.id}
              className="transform transition-transform hover:scale-105 hover:shadow-lg rounded-lg"
            >
              <ProductCard item={p} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg mt-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
