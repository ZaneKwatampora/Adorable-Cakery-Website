import React, { useState } from 'react';
import axios from '../../services/axios';
import { Loader, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'paid', 'delivered', 'cancelled'];

const UpdateOrderForm = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/90 backdrop-blur border border-pink-200 rounded-2xl shadow-md animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Update Order Status</h3>

      {message.text && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded-md border transition ${message.type === 'success'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Order ID */}
        <div className="relative">
          <input
            id="orderId"
            type="number"
            name="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder=" "
            className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition"
          />
          <label
            htmlFor="orderId"
            className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all"
          >
            Order ID
          </label>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="peer w-full appearance-none border border-gray-300 rounded-md px-3 pt-5 pb-2 pr-10 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition bg-white"
          >
            <option value="" disabled hidden />
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          {/* Label */}
          <label
            htmlFor="status"
            className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all"
          >
            Select Status
          </label>

          {/* Dropdown Icon */}
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-semibold transition-all duration-200 ${loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700'
            }`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Status'
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateOrderForm;
