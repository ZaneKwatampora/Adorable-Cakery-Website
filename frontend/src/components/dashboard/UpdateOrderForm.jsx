import React, { useState } from 'react';
import axios from '../../services/axios';

const STATUS_OPTIONS = ['pending', 'processing', 'paid', 'delivered', 'cancelled'];

const UpdateOrderForm = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdate = async () => {
    if (!orderId || !status) {
      setMessage({ text: 'Please enter Order ID and select a status.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/orders/${orderId}/update-status/`, { status });
      setMessage({ text: 'Order status updated successfully.', type: 'success' });
      setOrderId('');
      setStatus('');
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to update order. Please check the Order ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-pink-600">Update Order Status</h3>

      {message.text && (
        <div className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Select Status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
          }`}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </div>
  );
};

export default UpdateOrderForm;
