import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const PRODUCTS_PER_PAGE = 6;

const ManageProducts = ({ refreshStats }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products/');
      setProducts(res.data);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    setVisibleProducts(products.slice(start, end));
  }, [currentPage, products]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}/`);
      fetchProducts();
      if (refreshStats) refreshStats();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  if (loading) return <p className="text-center text-pink-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-pink-100 relative group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <h4 className="text-lg font-bold text-black group-hover:text-pink-600 transition-colors duration-200">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-sm mt-2">
                <span className="font-medium text-black">Category:</span> {product.category.name}
              </p>
              <p className="text-sm">
                <span className="font-medium text-black">Flavour:</span> {product.flavour_display}
              </p>
              <button
                onClick={() => handleDelete(product.id)}
                className="mt-4 inline-block px-4 py-1 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-full transition-colors"
              >
                Delete
              </button>
            </div>
            <div className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md group-hover:scale-110 transition-transform">
              ID: {product.id}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  currentPage === pageNum
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-white text-pink-600 border-pink-300 hover:bg-pink-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
