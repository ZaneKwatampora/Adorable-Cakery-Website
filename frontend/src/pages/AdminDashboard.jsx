import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Users,
  ShieldCheck,
  User,
} from 'lucide-react';

import OrdersList from '../components/dashboard/OrdersList';
import UpdateOrderForm from '../components/dashboard/UpdateOrderForm';
import BulkUpdateOrders from '../components/dashboard/BulkUpdateOrders';
import ExpensesList from '../components/dashboard/ExpensesList';
import AddExpense from '../components/dashboard/AddExpense';
import ProfitChart from '../components/dashboard/ProfitChart';
import UserList from '../components/dashboard/UserList';

const NON_CLICKABLE_STATS = ['Admins', 'Regular Users', 'Total Sales'];

const STAT_DETAILS = {
  'Total Orders': {
    icon: ShoppingCart,
    navItems: [
      { label: 'All Orders', component: <OrdersList /> },
      { label: 'Update Single Order', component: <UpdateOrderForm /> },
      { label: 'Bulk Update', component: <BulkUpdateOrders /> },
    ],
  },
  'Total Sales': {
    icon: DollarSign,
    navItems: [
      { label: 'Sales Overview', component: <p>Sales overview coming soon.</p> },
      { label: 'Monthly Breakdown', component: <p>Monthly breakdown coming soon.</p> },
    ],
  },
  Expenses: {
    icon: TrendingUp,
    navItems: [
      { label: 'Expense Log', component: <ExpensesList /> },
      { label: 'Add Expense', component: <AddExpense refreshStats={() => fetchStats()} /> },
    ],
  },
  Profit: {
    icon: PiggyBank,
    navItems: [
      { label: 'Profit Trends', component: <ProfitChart /> },
    ],
  },
  'Total Users': {
    icon: Users,
    navItems: [
      { label: 'All Users', component: <UserList /> },
    ],
  },
  Admins: {
    icon: ShieldCheck,
    navItems: [
      { label: 'Admin List', component: <p>Admins and permissions.</p> },
      { label: 'Permissions', component: <p>Edit roles and access.</p> },
    ],
  },
  'Regular Users': {
    icon: User,
    navItems: [
      { label: 'User List', component: <p>Regular users data table.</p> },
      { label: 'Engagement', component: <p>User engagement metrics.</p> },
    ],
  },
};
const StatCard = ({ title, value, icon: Icon, color, onClick, selected, isClickable }) => (
  <div
    onClick={isClickable ? onClick : undefined}
    className={`bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-center 
      transition-transform duration-300 ease-in-out 
      ${isClickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'cursor-not-allowed opacity-70'} 
      ${selected ? 'ring-2 ring-blue-500' : ''}`}
  >
    <div>
      <h3 className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`rounded-full p-3 ${color} bg-opacity-20`}>
      <Icon size={30} className={`${color.split(' ')[1]} drop-shadow`} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/stats/');
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats && [
    { title: 'Total Orders', value: stats.total_orders, color: 'bg-blue-500 text-blue-600' },
    { title: 'Expenses', value: `Ksh ${stats.total_expenses}`, color: 'bg-yellow-500 text-yellow-600' },
    { title: 'Profit', value: `Ksh ${stats.profit}`, color: 'bg-purple-500 text-purple-600' },
    { title: 'Total Users', value: stats.total_users, color: 'bg-cyan-500 text-cyan-600' },
    { title: 'Admins', value: stats.total_admins, color: 'bg-red-500 text-red-600' },
    { title: 'Regular Users', value: stats.total_regular_users, color: 'bg-orange-500 text-orange-600' },
    { title: 'Total Sales', value: `Ksh ${stats.total_sales}`, color: 'bg-green-500 text-green-600' },
  ];

  if (loading) return <p className="text-center text-lg text-gray-600 mt-20">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  const selectedDetails = selectedStat && STAT_DETAILS[selectedStat];

  return (
    <div className="p-6 pt-24 flex flex-col md:flex-row gap-6 transition-all duration-500 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div
        className={`grid gap-6 transition-all duration-500 ${
          selectedStat ? 'md:grid-cols-1 md:w-1/3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'
        }`}
      >
        {statCards.map((card) => {
          const isClickable = !NON_CLICKABLE_STATS.includes(card.title);
          return (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={STAT_DETAILS[card.title]?.icon}
              color={card.color}
              onClick={() => {
                if (isClickable) {
                  setSelectedStat(card.title);
                  setActiveTabIndex(0);
                }
              }}
              selected={selectedStat === card.title}
              isClickable={isClickable}
            />
          );
        })}
      </div>

      {/* Details Panel */}
      {selectedStat && selectedDetails && !NON_CLICKABLE_STATS.includes(selectedStat) && (
        <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl shadow-xl border animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedStat} Details</h2>
            <button
              onClick={() => {
                setSelectedStat(null);
                setActiveTabIndex(0);
              }}
              className="text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
            {selectedDetails.navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setActiveTabIndex(index)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all font-medium
                  ${index === activeTabIndex
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {React.cloneElement(
              selectedDetails.navItems[activeTabIndex]?.component,
              { refreshStats: fetchStats }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;