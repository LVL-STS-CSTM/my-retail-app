
import React, { useState, useEffect } from 'react';
import { Product, Material, Color } from '../types';
import ProductGrid from './ProductGrid';

interface ProductPageProps {
    product: Product;
    initialColor?: string;
    onColorChange: (color: string) => void;
    onNavigate: (path: string) => void;
    showToast: (message: string) => void;
    materials: Material[];
    allProducts: Product[];
    onProductClick: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, initialColor, onColorChange, onNavigate, showToast, materials, allProducts, onProductClick }) => {
    const getInitialColor = (): Color => {
        if (initialColor) {
            const foundColor = product.availableColors.find(c => c.name.toLowerCase() === initialColor.toLowerCase());
            if (foundColor) return foundColor;
        }
        return product.availableColors.length > 0 ? product.availableColors[0] : { name: 'default', hex: '#FFFFFF' };
    };

    const [selectedColor, setSelectedColor] = useState<Color>(getInitialColor());
    const [selectedImage, setSelectedImage] = useState(0);
    
    useEffect(() => {
        if (initialColor && initialColor.toLowerCase() !== selectedColor.name.toLowerCase()) {
            const foundColor = product.availableColors.find(c => c.name.toLowerCase() === initialColor.toLowerCase());
            if (foundColor) {
                setSelectedColor(foundColor);
            }
        }
    }, [initialColor, product.availableColors, selectedColor.name]);
    
    const handleColorSelect = (color: Color) => {
        setSelectedColor(color);
        setSelectedImage(0); 
        onColorChange(color.name);
    };

    const currentImages = product.imageUrls[selectedColor.name] || [];

    const relatedProducts = allProducts.filter(p => 
        p.id !== product.id && 
        (p.categoryGroup === product.categoryGroup || p.tags?.some((t: string) => product.tags?.includes(t)))
    ).slice(0, 4);

    const getMaterialInfo = (materialId?: string) => {
        if (!materialId) return null;
        return materials.find(m => m.id === materialId);
    };

    const material = getMaterialInfo(product.materialId);
    
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Image gallery */}
                    <div>
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                            {currentImages.length > 0 ? (
                                <img src={currentImages[selectedImage]} alt={`${product.name} in ${selectedColor.name}`} className="w-full h-full object-center object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center"><span className="text-gray-500">Image not available</span></div>
                            )}
                        </div>
                        {currentImages.length > 1 && (
                            <div className="mt-2 grid grid-cols-5 gap-2">
                                {currentImages.map((img, index) => (
                                    <button key={index} onClick={() => setSelectedImage(index)} className={`block h-16 w-full rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedImage === index ? 'ring-2 ring-indigo-500' : ''}`}>
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-center object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                            <p className="text-3xl text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                            <div className="mt-6">
                                <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                                <div className="flex items-center space-x-3 mt-2">
                                    {product.availableColors.map(color => (
                                        <button 
                                            key={color.name} 
                                            onClick={() => handleColorSelect(color)} 
                                            className={`h-8 w-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedColor.name === color.name ? 'ring-2 ring-indigo-500' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            <span className="sr-only">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="text-base text-gray-700">{product.description}</p>
                            </div>
                            <div className="mt-8">
                                <button
                                    type="button"
                                    className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => {
                                        showToast('Added to quote!');
                                    }}
                                >
                                    Add to Quote
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-10">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Details</h3>
                                <div className="mt-2 text-base text-gray-700">
                                    {product.details ? <p>{JSON.stringify(product.details)}</p> : <p>No details available.</p>}
                                </div>
                            </div>
                            {material && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900">Fabric & Care</h3>
                                    <div className="mt-2 text-base text-gray-700">
                                        <p>{material.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">You might also like</h2>
                        <ProductGrid products={relatedProducts} onProductClick={onProductClick} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
