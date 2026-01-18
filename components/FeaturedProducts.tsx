
import React from 'react';
import { useProductData } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts: React.FC = () => {
    const { products } = useProductData();
    // Simple logic to feature a few products. In a real app, this might be based on a 'featured' flag.
    const featuredProducts = products.slice(0, 4);

    if (featuredProducts.length === 0) return null;

    return (
        <section className="bg-white py-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-gray-800">Featured Products</h2>
                    <p className="mt-4 text-lg text-gray-600">Check out our most popular and newest items.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/collection/All" className="bg-gray-800 text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-900 transition-colors">Shop All</Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
