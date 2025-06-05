import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');

  const ordersPerPage = 3;

  useEffect(() => {
    axios.get('/api/orders/')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Oldest to newest
        setOrders(sorted);
      })
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const STATUS_LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const getStatusLabel = (status) => STATUS_LABELS[status] || status;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-3xl font-bold mb-6 text-center text-pink-600">All Orders</h3>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="All">All Statuses</option>
          {Object.keys(STATUS_LABELS).map(status => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <ul className="space-y-6">
        {currentOrders.map(order => (
          <li key={order.id} className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg font-semibold text-gray-700">Order #{order.id}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-gray-700"><span className="font-medium">Total:</span> Ksh {order.total_price}</p>
            <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
            <div className="mt-3">
              <p className="font-semibold text-gray-800 mb-1">Items:</p>
              <ul className="list-disc list-inside text-gray-600">
                {(order.order_items || order.items)?.map((item, idx) => (
                  <li key={idx}>{item.product_name} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-white ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-white ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
