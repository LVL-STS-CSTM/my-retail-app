
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    title: string;
    maxItems?: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, title, maxItems }) => {
    const itemsToDisplay = maxItems ? products.slice(0, maxItems) : products;

    if (itemsToDisplay.length === 0) {
        return null; // Don't render the section if there are no products
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-heading font-bold text-center text-gray-800 mb-8">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {itemsToDisplay.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;
