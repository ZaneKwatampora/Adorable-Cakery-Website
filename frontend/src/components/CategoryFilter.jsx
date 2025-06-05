import React from 'react';

const categories = ['all', 'cake', 'cupcake', 'dessert'];

export default function CategoryFilter({ current, set }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => set(cat)}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            current === cat
              ? 'bg-pink-500 text-white'
              : 'border-pink-300 text-pink-500 hover:bg-pink-100'
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
