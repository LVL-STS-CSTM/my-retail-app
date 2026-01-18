
import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
    products: Product[];
    onProductClick: (product: Product, selectedColor?: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
    if (!products || products.length === 0) {
        return <div className="text-center py-10">No products found.</div>;
    }

    const getProductImage = (product: Product): string | null => {
        if (product.availableColors.length > 0) {
            const firstColor = product.availableColors[0].name;
            if (product.imageUrls && product.imageUrls[firstColor] && product.imageUrls[firstColor][0]) {
                return product.imageUrls[firstColor][0];
            }
        }
        // Fallback to the first available image if the color-specific one isn't found
        const allImages = Object.values(product.imageUrls).flat();
        return allImages.length > 0 ? allImages[0] : null;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => {
                const imageUrl = getProductImage(product);
                return (
                    <div key={product.id} className="group relative cursor-pointer" onClick={() => onProductClick(product)}>
                        <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 lg:aspect-none">
                           {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Image Coming Soon</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
