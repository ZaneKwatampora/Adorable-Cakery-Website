import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const USERS_PER_PAGE = 5;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/users/');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = !searchTerm
      ? users
      : users.filter(
          (u) =>
            u.full_name.toLowerCase().includes(lowerSearch) ||
            u.email.toLowerCase().includes(lowerSearch)
        );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return `+254${digits.slice(1)}`;
    } else if (digits.startsWith('254')) {
      return `+${digits}`;
    } else if (digits.startsWith('7')) {
      return `+254${digits}`;
    }
    return phone;
  };

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <div className="mt-10 px-4 md:px-6 max-w-5xl mx-auto bg-white min-h-screen text-black">
      <h3 className="text-3xl font-bold mb-6 text-pink-600">All Users</h3>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="search"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 p-3 border border-pink-500 bg-white text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Search users"
        />
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition"
        >
          🔄 Refresh Users
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 italic">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white text-sm text-black">
              <thead className="bg-pink-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-left px-5 py-3 border-b border-pink-300">Name</th>
                  <th className="text-left px-5 py-3 border-b border-pink-300">Email</th>
                  <th className="text-left px-5 py-3 border-b border-pink-300">Phone</th>
                  <th className="text-left px-5 py-3 border-b border-pink-300">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-200">
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-pink-100 transition-colors duration-150"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {user.phone ? (
                        <a
                          href={`https://wa.me/${formatPhoneNumber(user.phone).replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                          title="Chat on WhatsApp"
                        >
                          {formatPhoneNumber(user.phone)}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-300 text-gray-800'
                        }`}
                      >
                        {user.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-500'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-500'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
