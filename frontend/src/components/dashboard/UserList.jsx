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

  useEffect(() => {
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
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <div className="mt-10 px-4 md:px-6 max-w-5xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-purple-800">All Users</h3>

      <input
        type="search"
        placeholder="🔍 Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Search users"
      />

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600 italic">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white text-sm text-gray-800">
              <thead className="bg-purple-100 text-purple-700 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-5 py-3 border-b border-purple-200">Name</th>
                  <th className="text-left px-5 py-3 border-b border-purple-200">Email</th>
                  <th className="text-left px-5 py-3 border-b border-purple-200">Phone</th>
                  <th className="text-left px-5 py-3 border-b border-purple-200">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-purple-50 transition-colors duration-150"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{user.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
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
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
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
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
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
