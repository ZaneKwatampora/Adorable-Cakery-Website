// components/dashboard/ProductManager.jsx
import React from 'react';
import ProductForm from './ProductForm';

const ProductManager = ({ refreshStats }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Add New Product</h3>
      <ProductForm onSuccess={refreshStats} />
    </div>
  );
};

export default ProductManager;
