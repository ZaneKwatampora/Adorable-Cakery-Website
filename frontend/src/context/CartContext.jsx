// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    
    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, variant, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.product.id === product.id && item.variant.kg === variant.kg
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id && item.variant.kg === variant.kg
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { product, variant, quantity }];
            }
        });
    };

    const removeFromCart = (productId, variantKg) => {
        setCart(prevCart => 
            prevCart.filter(
                item => !(item.product.id === productId && item.variant.kg === variantKg)
            )
        );
    };

    const updateQuantity = (productId, variantKg, newQuantity) => {
        if (newQuantity < 1) return;

        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId && item.variant.kg === variantKg
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce(
        (total, item) => total + item.variant.price * item.quantity,
        0
    );

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}