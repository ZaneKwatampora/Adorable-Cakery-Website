import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';


export default function Cart() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        clearCart,
    } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            if (cartCount === 0) throw new Error('Your cart is empty');
            setIsCheckingOut(true);
            navigate('/checkout');
        } catch (error) {
            setIsCheckingOut(false);
            Swal.fire({
                icon: 'error',
                title: 'Checkout Error',
                text: error.message,
            });
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                key="cart"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-4 top-24 bg-white shadow-2xl rounded-2xl p-5 w-[340px] max-h-[85vh] overflow-y-auto z-50 border border-pink-100 backdrop-blur-sm"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b pb-3">
                    <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                        🛍️ Cart <span className="text-sm text-gray-500">({cartCount})</span>
                    </h3>
                    {cartCount > 0 && (
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Clear cart?',
                                    text: 'This will remove all items from your cart.',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes, clear it!',
                                }).then(result => {
                                    if (result.isConfirmed) clearCart();
                                });
                            }}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Cart Items */}
                {cartCount === 0 ? (
                    <div className="text-center py-14">
                        <p className="text-gray-400 text-sm mb-2">Your cart is currently empty.</p>
                        <Link
                            to="/"
                            className="inline-block text-pink-600 hover:text-pink-700 text-sm font-medium"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-5">
                            {cart.map(item => (
                                <div
                                    key={`${item.product.id}-${item.variant.kg}`}
                                    className="flex gap-4 items-start border-b pb-3"
                                >
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-14 h-14 rounded-lg object-cover shadow"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {item.variant.kg} kg &middot; KES {item.variant.price}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center border rounded-md overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.variant.kg, item.quantity - 1)
                                                    }
                                                    className="px-2 py-0.5 text-sm text-gray-600 hover:bg-gray-100 transition"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 text-sm bg-gray-50">{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.variant.kg, item.quantity + 1)
                                                    }
                                                    className="px-2 py-0.5 text-sm text-gray-600 hover:bg-gray-100 transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id, item.variant.kg)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                ✕ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-5 border-t pt-3">
                            <div className="flex justify-between text-sm font-semibold text-gray-800 mb-3">
                                <span>Total:</span>
                                <span className="text-pink-600">KES {cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className={`w-full text-sm bg-pink-500 hover:bg-pink-600 transition text-white py-2 rounded-lg font-semibold shadow ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isCheckingOut ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                                                    5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
                                                    5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    'Checkout'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}