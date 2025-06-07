import React, { useState , useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import { FaShoppingCart } from 'react-icons/fa'; 

export default function CartIcon() {
    const { cartCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        }

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen]);

    return (
        <div className="relative group">
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="hover:text-pink-400 relative"
            >
                <FaShoppingCart className="text-1.5xl" />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                    </span>
                )}
            </button>

            {/* Hover Label */}
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 bg-pink-500 text-white text-sm px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Cart
            </div>

            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
        </div>
    );
}
