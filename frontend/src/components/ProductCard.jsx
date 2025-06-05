import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ item }) {
  const navigate = useNavigate();

  const getDefaultVariant = () =>
    item.variants?.find(v => v.kg === 0.5) || item.variants?.[0];

  const variant = getDefaultVariant();

  return (
    <div
      onClick={() => navigate(`/products/${item.id}`)}
      className="group relative cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"
    >
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600">
          KSH{' '}
          <span className="text-pink-600 font-bold">
            {variant?.price || 'N/A'}
          </span>{' '}
          for {variant?.kg}kg
        </p>

        <button
          className="w-full mt-2 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-sm transition-colors shadow-inner"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${item.id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
