import React, { useState } from 'react';
import axios from '../../services/axios';

const STATUS_OPTIONS = ['pending', 'processing', 'paid', 'delivered', 'cancelled'];

const BulkUpdateOrders = () => {
    const [updates, setUpdates] = useState([{ order_id: '', status: '' }]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (index, field, value) => {
        const newUpdates = [...updates];
        newUpdates[index][field] = value;
        setUpdates(newUpdates);
    };

    const addRow = () => {
        setUpdates([...updates, { order_id: '', status: '' }]);
    };

    const removeRow = (index) => {
        const newUpdates = updates.filter((_, i) => i !== index);
        setUpdates(newUpdates);
    };

    const handleSubmit = async () => {
        // Validate all fields
        const isValid = updates.every(u => u.order_id && u.status);
        if (!isValid) {
            setMessage({ text: 'Please fill in all order IDs and statuses.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await axios.patch('/api/orders/bulk-update-status/', { updates });
            setMessage({ text: 'Bulk update successful.', type: 'success' });
            setUpdates([{ order_id: '', status: '' }]);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Bulk update failed. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-center text-pink-600">Bulk Update Orders</h3>

            {message.text && (
                <div className={`mb-4 px-4 py-2 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                {updates.map((u, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Order ID"
                            value={u.order_id}
                            onChange={e => handleChange(idx, 'order_id', e.target.value)}
                            className="w-1/3 border px-3 py-2 rounded-md focus:ring-2 focus:ring-pink-400"
                        />

                        <select
                            value={u.status}
                            onChange={e => handleChange(idx, 'status', e.target.value)}
                            className="w-1/3 border px-3 py-2 rounded-md focus:ring-2 focus:ring-pink-400"
                        >
                            <option value="">Select Status</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => removeRow(idx)}
                            className="text-red-500 hover:underline text-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={addRow}
                    className="text-sm text-blue-600 hover:underline"
                >
                    + Add Another
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit Bulk Update'}
                </button>
            </div>
        </div>
    );
};

export default BulkUpdateOrders;
