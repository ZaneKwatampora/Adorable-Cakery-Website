import React, { useState } from 'react';
import axios from '../../services/axios';
import { ChevronDown, Loader } from 'lucide-react';

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
    if (window.confirm('Are you sure you want to remove this row?')) {
      const newUpdates = updates.filter((_, i) => i !== index);
      setUpdates(newUpdates);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = updates.every(u => u.order_id && u.status);
    if (!isValid) {
      setMessage({ text: 'Please fill in all order IDs and statuses.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/90 backdrop-blur border border-pink-200 rounded-2xl shadow-md animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 text-center text-pink-600">Bulk Update Orders</h3>

      {message.text && (
        <div
          role="alert"
          className={`mb-4 px-4 py-2 rounded-md text-sm font-medium border transition ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {updates.map((u, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {/* Order ID */}
            <div className="relative flex-1">
              <input
                id={`order_id_${idx}`}
                type="number"
                name={`order_id_${idx}`}
                value={u.order_id}
                onChange={(e) => handleChange(idx, 'order_id', e.target.value)}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition"
              />
              <label
                htmlFor={`order_id_${idx}`}
                className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all select-none"
              >
                Order ID
              </label>
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-1">
              <select
                id={`status_${idx}`}
                name={`status_${idx}`}
                value={u.status}
                onChange={(e) => handleChange(idx, 'status', e.target.value)}
                className="peer w-full appearance-none border border-gray-300 rounded-md px-3 pt-5 pb-2 pr-10 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition bg-white"
              >
                <option value="" disabled hidden />
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <label
                htmlFor={`status_${idx}`}
                className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all select-none"
              >
                Select Status
              </label>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="text-red-500 hover:underline text-sm select-none"
              aria-label={`Remove row ${idx + 1}`}
            >
              Remove
            </button>
          </div>
        ))}

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addRow}
            className="text-sm text-blue-600 hover:underline select-none"
            disabled={loading}
          >
            + Add Another
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-semibold transition duration-200 ${
              loading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Bulk Update'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUpdateOrders;
