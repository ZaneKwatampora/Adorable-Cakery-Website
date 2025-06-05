// src/api/products.js
import axiosInstance from '../services/axios';

export async function fetchProducts(category = 'all') {
  const params = category !== 'all' ? { category } : {};
  const res = await axiosInstance.get('/api/products/', { params });
  return res.data;
}

export async function fetchFeaturedProducts() {
  const res = await axiosInstance.get('/api/products/?limit=4');
  return res.data;
}

export async function fetchAllVariants() {
  const res = await axiosInstance.get('/api/variants/');
  return res.data;
}
