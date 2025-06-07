import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const { authTokens } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        address: '',
        payment_method: '',
        delivery_method: 'UBER',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const buildOrderItems = () => {
        return cart.map(item => ({
            product: item.product.id,
            kg: parseFloat(item.variant.kg),
            quantity: item.quantity,
        }));
    };

    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            ...(authTokens?.access && { Authorization: `Bearer ${authTokens.access}` })
        };
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens) {
            Swal.fire('Unauthorized', 'You must be logged in to place an order.', 'warning');
            return;
        }

        if (!form.address || !form.payment_method || !form.delivery_method) {
            Swal.fire('Incomplete Info', 'Please fill in all fields.', 'warning');
            return;
        }

        setLoading(true);

        const orderData = {
            address: form.address,
            payment_method: form.payment_method,
            delivery_method: form.delivery_method,
            order_items: buildOrderItems(),
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/api/orders/', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Failed to place order');
            }

            const order = await res.json();

            if (form.payment_method === 'mpesa') {
                const mpesaRes = await fetch(`http://127.0.0.1:8000/api/orders/${order.id}/pay/`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                });

                if (!mpesaRes.ok) {
                    const errorData = await mpesaRes.json();
                    throw new Error(errorData.detail || 'Failed to initiate M-Pesa payment');
                }

                await mpesaRes.json();
                triggerConfetti();
                await Swal.fire(
                    'Order Placed!',
                    'Please check your email and spam for confirmation. Our team will get in touch with you for further details.',
                    'success'
                );
            } else {
                triggerConfetti();
                await Swal.fire(
                    'Order Placed!',
                    'Please check your email and spam for confirmation. Our team will get in touch with you for further details.',
                    'success'
                );
            }

            clearCart();
            navigate('/');
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-2xl rounded-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className="text-3xl font-bold mb-6 text-pink-600 flex items-center gap-2">
                🧾 Checkout
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address (Google Maps Link)</label>
                    <input
                        type="url"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-pink-400 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-pink-400 outline-none"
                        required
                    >
                        <option value="">-- Select --</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="cod">Cash on Delivery</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Method</label>
                    <select
                        name="delivery_method"
                        value={form.delivery_method}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-pink-400 outline-none"
                        required
                    >
                        <option value="UBER">Uber</option>
                        <option value="Pickup">Pickup</option>
                    </select>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg text-gray-800 mb-4">
                        <span>Total:</span>
                        <span className="text-pink-600">KES {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white py-3 rounded-xl transition-all duration-200 font-semibold flex justify-center items-center shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Confirm Order'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
