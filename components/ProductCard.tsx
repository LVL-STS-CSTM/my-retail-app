
import React from 'react';
import { Product } from '../types';

/**
 * @interface ProductCardProps
 * @description Props for the ProductCard component.
 * @property {Product} product - The product data to display.
 * @property {(product: Product) => void} onProductClick - Callback function executed when the card is clicked.
 */
interface ProductCardProps {
    product: Product;
    onProductClick: (product: Product) => void;
}

/**
 * @description A card component to display a single product in a grid.
 * It shows the product image and name, and features hover effects for better user experience.
 * On hover, it transitions to the second product image if available.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    // Flatten all image URLs from all colors to get a list of available images.
    const allImages = Object.values(product.imageUrls || {}).flat();
    const primaryImageUrl = allImages[0] || 'https://placehold.co/600x800?text=No+Image';
    const secondaryImageUrl = allImages[1] || primaryImageUrl;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/94a3b8?text=Image+Unavailable';
        e.currentTarget.onerror = null;
    };

    return (
        <div 
            className="group bg-white overflow-hidden shadow-sm flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 relative cursor-pointer"
            onClick={() => onProductClick(product)}
        >
            {/* Image container with a fixed aspect ratio (pt-[130%]) */}
            <div className="w-full pt-[130%] relative overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
                    {/* Primary Image */}
                    <img
                        src={primaryImageUrl}
                        alt={product.name}
                        onError={handleImageError}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    {/* Secondary Image (on hover) */}
                    <img
                        src={secondaryImageUrl}
                        alt={`${product.name} alternate view`}
                        onError={handleImageError}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                    />
                </div>
            </div>
            
            {/* Product details section */}
            <div className="p-4 text-center flex flex-col flex-grow justify-end">
                <h3 className="text-sm font-light uppercase tracking-wide text-gray-800 mb-1.5 leading-tight">
                    {product.name}
                </h3>
            </div>
            
            {/* Bestseller tag, displayed conditionally */}
            {product.isBestseller && (
                <span className="absolute top-3 left-3 bg-[#3A3A3A] text-white text-[10px] font-semibold py-1 px-2.5 uppercase tracking-wider z-10">
                    Bestseller
                </span>
            )}
        </div>
    );
};

export default ProductCard;
