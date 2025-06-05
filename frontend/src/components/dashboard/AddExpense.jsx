import React, { useState } from 'react';
import axios from '../../services/axios';

const AddExpense = ({ refreshStats }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const { title, amount, category } = formData;

    if (!title || !amount || !category) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });

      await axios.post('/api/expenses/', formData);
      setMessage({ text: 'Expense added successfully!', type: 'success' });

      setFormData({ title: '', amount: '', category: '', notes: '' });

      if (refreshStats) refreshStats();
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to add expense. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-pink-400">Add New Expense</h3>

      <div className="space-y-3">
        <input
          name="title"
          placeholder="e.g. Flour purchase"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount (e.g. 500)"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="category"
          placeholder="e.g. Ingredients / Packaging"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="notes"
          placeholder="Optional notes (e.g. bought from XYZ vendor)"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />

        {message.text && (
          <div
            className={`text-sm p-2 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
