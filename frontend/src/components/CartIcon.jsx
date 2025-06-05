// src/components/CartIcon.js
import React, { useState , useEffect, useRef} from 'react';
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
        <div className="relative">
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="hover:text-pink-400 relative"
                title="Cart"
            >
                <FaShoppingCart className="text-1.5xl" />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                    </span>
                )}
            </button>
            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
        </div>
    );
}