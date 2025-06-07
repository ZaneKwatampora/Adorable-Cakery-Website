import axiosInstance from '../services/axios';

export async function fetchProducts(input = 'all') {
  let params = {};
  if (typeof input === 'string') {
    if (input !== 'all') {
      params.category = input;
    }
  }

  // If input is an object (new usage), use it as-is
  if (typeof input === 'object') {
    params = input;
  }

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
