import React, { useState } from 'react';
import axios from '../../services/axios';
import { Loader, PlusCircle } from 'lucide-react';

const InputField = ({ id, label, type = 'text', value, onChange, required }) => (
  <div className="relative">
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition"
      aria-labelledby={`${id}-label`}
    />
    <label
      id={`${id}-label`}
      htmlFor={id}
      className="absolute left-3 top-2 text-xs text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm transition-all pointer-events-none"
    >
      {label}
    </label>
  </div>
);

const TextAreaField = ({ id, label, value, onChange }) => (
  <div className="relative">
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={3}
      className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 transition resize-none"
      aria-labelledby={`${id}-label`}
    />
    <label
      id={`${id}-label`}
      htmlFor={id}
      className="absolute left-3 top-2 text-xs text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm transition-all pointer-events-none"
    >
      {label}
    </label>
  </div>
);

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-pink-200 animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 text-pink-500 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" />
        Add New Expense
      </h3>

      <div className="space-y-5">
        <InputField
          id="title"
          label="Expense Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <InputField
          id="amount"
          label="Amount (e.g. 500)"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <InputField
          id="category"
          label="Category (e.g. Ingredients)"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <TextAreaField
          id="notes"
          label="Optional Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        {message.text && (
          <div
            className={`text-sm px-4 py-2 rounded-md transition ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-semibold transition-all duration-200 ${
            loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700'
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
