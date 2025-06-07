import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { Loader, ChevronDown, ImagePlus } from 'lucide-react';

const KG_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const ProductForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState('');
  const [flavour, setFlavour] = useState('');
  const [isSpecial, setIsSpecial] = useState(false);
  const [categories, setCategories] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [variants, setVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [flavRes, catRes] = await Promise.all([
          axios.get('/api/flavours/'),
          axios.get('/api/categories/')
        ]);
        setFlavours(flavRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };
    fetchInitialData();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setPreviewUrl(null);
    setCategory('');
    setFlavour('');
    setIsSpecial(false);
    setVariants({});
  };

  const handleVariantChange = (kg, isChecked) => {
    setVariants((prev) => {
      const updated = { ...prev };
      if (isChecked) updated[kg] = '';
      else delete updated[kg];
      return updated;
    });
  };

  const handlePriceChange = (kg, price) => {
    const value = parseFloat(price);
    setVariants((prev) => ({ ...prev, [kg]: isNaN(value) ? '' : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return setMessage({ text: 'Please upload an image.', type: 'error' });
    }

    const selectedVariants = Object.entries(variants).filter(([_, price]) => price !== '');

    if (selectedVariants.length === 0) {
      return setMessage({ text: 'Select at least one KG and price.', type: 'error' });
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('category_name', category);
      formData.append('flavour_name', flavour);
      formData.append('is_special', isSpecial);

      const productRes = await axios.post('/api/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await Promise.all(
        selectedVariants.map(([kg, price]) =>
          axios.post('/api/variants/', {
            product: productRes.data.id,
            kg: parseFloat(kg),
            price: parseFloat(price)
          })
        )
      );

      setMessage({ text: 'Product created successfully!', type: 'success' });
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Create product error', err);
      setMessage({ text: 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white/90 backdrop-blur border border-pink-200 rounded-2xl shadow-md animate-fade-in">
      <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Add New Product</h3>

      {message.text && (
        <div className={`mb-4 text-sm px-4 py-2 rounded-md border transition ${
          message.type === 'success'
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="peer w-full border rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 placeholder-transparent"
            placeholder="Product Name"
            required
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
            Product Name
          </label>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="peer w-full border rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 placeholder-transparent"
            placeholder="Description"
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
            Description
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center relative hover:bg-pink-50 transition">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="mx-auto max-h-40 object-contain rounded-md" />
            ) : (
              <div className="flex flex-col items-center justify-center text-pink-500">
                <ImagePlus className="w-8 h-8 mb-1" />
                <p className="text-sm">Click to upload or drag an image</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="peer w-full appearance-none border rounded-md px-3 pt-5 pb-2 pr-10 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
            required
          >
            <option value="" disabled hidden />
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs">
            Select Category
          </label>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Flavour Select */}
        <div className="relative">
          <select
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
            className="peer w-full appearance-none border rounded-md px-3 pt-5 pb-2 pr-10 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
            required
          >
            <option value="" disabled hidden />
            {flavours.map((f) => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
          <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs">
            Select Flavour
          </label>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Is Special */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSpecial}
            onChange={(e) => setIsSpecial(e.target.checked)}
            className="accent-pink-600"
          />
          <label className="text-sm">Mark as Special Product</label>
        </div>

        {/* Variants */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-600">Variants (KG & Price)</label>
          <div className="grid grid-cols-2 gap-4">
            {KG_OPTIONS.map((kg) => (
              <div key={kg} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={kg in variants}
                  onChange={(e) => handleVariantChange(kg, e.target.checked)}
                  disabled={loading}
                  className='accent-pink-600'
                />
                <span className="text-sm">{kg} kg</span>
                <input
                  type="number"
                  value={variants[kg] ?? ''}
                  onChange={(e) => handlePriceChange(kg, e.target.value)}
                  placeholder="Price"
                  disabled={!Object.hasOwn(variants, kg)}
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-white font-semibold ${
            loading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
          } transition`}
        >
          {loading && <Loader className="animate-spin w-4 h-4" />}
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
