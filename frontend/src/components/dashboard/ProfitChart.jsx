import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfitChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/profit/').then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading chart...</p>;

  const chartData = {
    labels: ['Expenses', 'Sales'],
    datasets: [
      {
        label: 'Amount (ksh)',
        data: [data.total_expenses, data.total_sales],
        backgroundColor: ['#f87171', '#34d399'],
      },
    ],
  };

  const profitColor = data.profit >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Profit Chart</h3>
      <Bar data={chartData} />
      <p className={`mt-2 text-lg font-bold ${profitColor}`}>
        Profit: Ksh {data.profit.toFixed(2)}
      </p>
    </div>
  );
};

export default ProfitChart;
