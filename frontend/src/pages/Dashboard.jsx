import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../services/axios';
import { AuthContext } from '../context/AuthContext';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    delivered: 'bg-teal-100 text-teal-800',
    cancelled: 'bg-red-100 text-red-800',
};

const paymentMethodLabels = {
    mpesa: 'M-Pesa',
    paypal: 'PayPal',
    cod: 'Cash on Delivery',
};

const deliveryMethodLabels = {
    UBER: 'Uber',
    PICKUP: 'Pickup',
};

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const { logoutUser } = useContext(AuthContext);

    useEffect(() => {
        axiosInstance.get('/api/profile/')
            .then(res => {
                setProfile(res.data);
                setLoadingProfile(false);
            })
            .catch(err => {
                console.log(err);
                setLoadingProfile(false);
            });

        axiosInstance.get('/api/orders/')
            .then(res => {
                setOrders(res.data);
                setLoadingOrders(false);
            })
            .catch(err => {
                console.log(err);
                setLoadingOrders(false);
            });
    }, []);

    if (loadingProfile || loadingOrders) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <svg className="animate-spin h-12 w-12 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen pt-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, {profile.full_name} 👋
                    </h1>
                    <button
                        onClick={logoutUser}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Orders</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">You have no orders yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">Order ID: {order.id}</span>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="mb-2 space-y-1">
                                        {order.order_items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm text-gray-700">
                                                <span>
                                                    {item.product_name} ({item.kg} kg) x {item.quantity}
                                                </span>
                                                <span>KES {item.item_total.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                                            Payment: {paymentMethodLabels[order.payment_method] || order.payment_method}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                                            Delivery: {deliveryMethodLabels[order.delivery_method] || order.delivery_method}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            Paid: {order.is_paid ? 'Yes' : 'No'}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                                            Date: {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-sm font-semibold text-right text-gray-800">
                                        <span className="font-semibold">
                                            Total: KES {typeof order.total_price === 'number'
                                                ? order.total_price.toFixed(2)
                                                : parseFloat(order.total_price).toFixed(2)}
                                        </span>
                                    </div>

                                    {order.address && (
                                        <div className="mt-3">
                                            <a
                                                href={order.address}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-pink-600 hover:underline"
                                            >
                                                View Delivery Address
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
