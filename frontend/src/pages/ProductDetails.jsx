import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { StarIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [selectedKg, setSelectedKg] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const commentRef = useRef(null);
    const { addToCart, cartCount } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts().then((data) => {
            const selected = data.find((item) => item.id === parseInt(id));
            setProduct(selected);
            setSelectedKg(selected?.variants?.[0]);

            const relatedItems = data.filter(
                (item) => item.category?.name === selected?.category?.name && item.id !== selected?.id
            );
            setRelated(relatedItems);
        });
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await axiosInstance.get(`/api/products/${id}/reviews/`);
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            if (editingReviewId) {
                await axiosInstance.put(`/api/reviews/${editingReviewId}/`, {
                    comment: newComment,
                    rating: newRating,
                });
                Swal.fire('Success', 'Review updated successfully', 'success');
                setEditingReviewId(null);
            } else {
                await axiosInstance.post(`/api/products/${id}/reviews/`, {
                    comment: newComment,
                    rating: newRating,
                });
                Swal.fire('Success', 'Review submitted successfully', 'success');
            }
            setNewComment('');
            setNewRating(5);
            fetchReviews();
        } catch (error) {
            Swal.fire('Error', 'Failed to submit review', 'error');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This review will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosInstance.delete(`/api/reviews/${reviewId}/`);
                fetchReviews();
                Swal.fire('Deleted', 'Your review has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete review', 'error');
            }
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Continue Browsing'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to login page - adjust this path based on your routing
                    window.location.href = '/login';
                }
            });
            return;
        }

        addToCart(product, selectedKg);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Added to cart!',
            showConfirmButton: false,
            timer: 1500,
            toast: true
        });
    };

    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;

    if (!product) return <p className="text-center py-10">Loading...</p>;

    return (
        <main className="max-w-6xl mx-auto p-4 text-gray-800 mt-20">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-all group overflow-hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        className="w-8 h-8 transition-transform group-hover:rotate-[360deg] duration-700 ease-in-out rolling-icon"
                    >
                        <path d="M32 2C15.43 2 2 15.43 2 32s13.43 30 30 30 30-13.43 30-30S48.57 2 32 2zm0 4c14.36 0 26 11.64 26 26S46.36 58 32 58 6 46.36 6 32 17.64 6 32 6zm0 10c-8.84 0-16 7.16-16 16 0 3.79 1.32 7.25 3.51 9.99.68.84 1.88.97 2.71.3s.97-1.88.3-2.71A11.948 11.948 0 0 1 20 32c0-6.62 5.38-12 12-12s12 5.38 12 12-5.38 12-12 12c-.38 0-.75-.02-1.12-.06a1.998 1.998 0 1 0-.38 3.97c.5.05 1.01.09 1.5.09 8.84 0 16-7.16 16-16s-7.16-16-16-16z" />
                    </svg>
                    <span className="text-sm back-text opacity-0 translate-x-[-10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                        Back to {product?.category?.name}
                    </span>
                </Link>
            </div>

            {/* Product Card */}
            <div className="bg-white shadow-xl rounded-2xl p-6 grid md:grid-cols-2 gap-8 items-start">
                <div className="overflow-hidden rounded-xl group">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        {product.name}
                        <StarRating rating={averageRating} />
                        <span className="text-sm text-gray-500">({reviews.length})</span>
                    </h1>
                    <p className="text-pink-600 mb-1 capitalize">{product.category?.name}</p>
                    <p className="mb-4 text-gray-600">{product.description}</p>

                    <label className="block mb-1 font-medium">Size:</label>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
                        value={selectedKg?.kg}
                        onChange={(e) => {
                            const match = product.variants.find(
                                (v) => v.kg === parseFloat(e.target.value)
                            );
                            setSelectedKg(match);
                        }}
                    >
                        {product.variants.map((variant) => (
                            <option key={variant.kg} value={variant.kg}>
                                {variant.kg} kg
                            </option>
                        ))}
                    </select>

                    <p className="text-lg font-semibold mb-4">
                        Price: KES {selectedKg?.price}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        className={`px-6 py-2 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 ${
                            isAuthenticated 
                                ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                                : 'bg-gray-400 hover:bg-gray-500 text-white cursor-pointer'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                        {isAuthenticated && cartCount > 0 && (
                            <span className="bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {!isAuthenticated && (
                        <p className="text-sm text-gray-500 mt-2">
                            Please <Link to="/auth" className="text-pink-600 hover:underline">login</Link> to add items to your cart and place orders.
                        </p>
                    )}
                </div>
            </div>

            {/* Ratings & Reviews */}
            <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>

                {isAuthenticated && (
                    <div className="mb-6 bg-white rounded-xl p-4 shadow">
                        <textarea
                            ref={commentRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a review..."
                            className="w-full border rounded-md p-2 mb-2"
                        />
                        <div className="flex items-center gap-2 mb-2">
                            <label>Rating:</label>
                            <select
                                value={newRating}
                                onChange={(e) => setNewRating(parseInt(e.target.value))}
                                className="border p-1 rounded-md"
                            >
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleReviewSubmit}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
                        >
                            {editingReviewId ? 'Update Review' : 'Submit Review'}
                        </button>
                        {editingReviewId && (
                            <button
                                onClick={() => {
                                    setEditingReviewId(null);
                                    setNewComment('');
                                    setNewRating(5);
                                }}
                                className="ml-4 text-gray-600 underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="mb-6 bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-gray-600">
                            <Link to="/auth" className="text-pink-600 hover:underline font-medium">Login</Link> to write a review
                        </p>
                    </div>
                )}

                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`border p-4 rounded-xl bg-white shadow-md transform transition-transform duration-300 hover:scale-[1.02] ${currentUser?.id === review.user ? 'border-pink-300' : ''
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold">{review.user_full_name}</p>
                                {currentUser?.id === review.user && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => {
                                                setNewComment(review.comment);
                                                setNewRating(review.rating);
                                                setEditingReviewId(review.id);
                                                commentRef.current?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="text-gray-700 text-sm mt-1">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Products */}
            <section className="mt-12">
                <h2 className="text-xl font-bold mb-6">Related Products</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {related.length > 0 ? (
                        related.map((item) => <ProductCard key={item.id} item={item} />)
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            No related products found.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}