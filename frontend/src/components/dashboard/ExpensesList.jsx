import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses/');
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load expenses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const total = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0).toFixed(2);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Expense Log</h3>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-lg text-gray-800">{expense.title}</p>
                <p className="text-gray-600">💰 <span className="font-medium"> Ksh {parseFloat(expense.amount).toFixed(2)}</span></p>
                <p className="text-gray-600">📂 {expense.category}</p>
                {expense.notes && (
                  <p className="text-gray-500 italic">📝 {expense.notes}</p>
                )}
                {expense.created_at && (
                  <p className="text-xs text-gray-400 mt-1">📅 {formatDate(expense.created_at)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="text-right text-lg font-semibold text-black">
            Total: Ksh <span className='text-red-700'> -{total}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesList;
