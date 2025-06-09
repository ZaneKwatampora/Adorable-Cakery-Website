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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/90 backdrop-blur border border-pink-200 rounded-2xl shadow-md animate-fade-in
                    sm:p-8
                    ">
      <h3 className="text-2xl font-bold mb-6 text-pink-600 text-center">Add New Product</h3>

      {message.text && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded-md border transition ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="peer w-full border rounded-md px-3 pt-5 pb-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300 placeholder-transparent resize-none min-h-[80px]"
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
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center relative hover:bg-pink-50 transition cursor-pointer">
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
                <p className="text-sm select-none">Click to upload or drag an image</p>
              </div>
            )}
          </div>
        </div>

        {/* Category & Flavour - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Category Select */}
          <div className="relative z-20">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="peer w-full appearance-none border rounded-md px-3 pt-5 pb-2 pr-10 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              required
            >
              <option value="" disabled hidden />
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs">
              Select Category
            </label>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Flavour Select */}
          <div className="relative z-20">
            <select
              value={flavour}
              onChange={(e) => setFlavour(e.target.value)}
              className="peer w-full appearance-none border rounded-md px-3 pt-5 pb-2 pr-10 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              required
            >
              <option value="" disabled hidden />
              {flavours.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs">
              Select Flavour
            </label>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Is Special */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={(e) => setIsSpecial(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-9 h-5 bg-pink-300 rounded-full peer peer-checked:bg-pink-600
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300
                        after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white
                        relative"
            ></div>
          </label>
          <span className="text-sm select-none">Mark as Special Product</span>
        </div>

        {/* Variants */}
        <div>
          <label className="block mb-3 font-medium text-sm text-gray-700">Select KG & Set Price</label>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto
                      border border-pink-300 rounded-md p-3"
          >
            {KG_OPTIONS.map((kg) => (
              <div key={kg} className="flex flex-col items-center gap-1">
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={variants.hasOwnProperty(kg)}
                    onChange={(e) => handleVariantChange(kg, e.target.checked)}
                    className="peer sr-only"
                    disabled={loading}
                  />
                  <span
                    className="w-5 h-5 flex justify-center items-center rounded-md border border-pink-300
                               peer-checked:bg-pink-600 peer-checked:border-pink-600
                               transition-colors"
                  >
                    ✓
                  </span>
                  <span className="ml-2 text-sm">{kg} kg</span>
                </label>

                {variants.hasOwnProperty(kg) && (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variants[kg]}
                    onChange={(e) => handlePriceChange(kg, e.target.value)}
                    placeholder="Price (ksh)"
                    className="w-full text-center text-sm rounded-md border border-pink-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    disabled={loading}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-semibold rounded-md py-2 flex justify-center items-center gap-2 transition"
        >
          {loading && <Loader className="animate-spin h-5 w-5" />}
          {loading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
