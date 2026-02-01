
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ProductColor } from '../types';

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products } = useProducts();
    const { addToCart } = useCart();

    const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (product && selectedColor && selectedSize) {
            addToCart({ 
                product,
                color: selectedColor,
                size: selectedSize,
                quantity 
            });
            alert(`${quantity} x ${product.name} (${selectedColor.name}, ${selectedSize}) added to cart.`);
        } else {
            alert('Please select a color and size.');
        }
    };

    const handleRequestQuote = () => {
        // This functionality can be re-integrated with a proper quote context if needed
        alert('Redirecting to quote page...');
    };

    if (!product) {
        return <div className="text-center py-20 font-sans">Product not found.</div>;
    }

    return (
        <div className="bg-white font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg shadow-inner overflow-hidden">
                            <img 
                                src={product.imageUrl}
                                alt={`${product.name}`}
                                className="w-full h-auto object-cover transition-all duration-300"
                                style={{aspectRatio: '1/1'}}
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="space-y-6">
                        <div>
                           <p className="text-sm font-medium text-gray-500">{product.brand}</p>
                           <h1 className="font-heading text-4xl font-bold text-gray-900 mt-1">{product.name}</h1>
                        </div>

                        <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

                        {/* Color Selector */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Color: <span className="font-normal">{selectedColor?.name}</span></h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map(color => (
                                    <button 
                                        key={color.name} 
                                        onClick={() => setSelectedColor(color)} 
                                        className={`w-10 h-10 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-indigo-500' : 'ring-1 ring-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* On-hand item options */}
                        {product.stockType === 'on-hand' && (
                            <>
                                 <div>
                                     <h3 className="text-md font-semibold text-gray-800 mb-3">Size:</h3>
                                     <div className="flex flex-wrap gap-3">
                                        {['S', 'M', 'L', 'XL'].map(size => (
                                            <button 
                                                key={size} 
                                                onClick={() => setSelectedSize(size)} 
                                                className={`px-5 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                 </div>
                                 <div>
                                     <h3 className="text-md font-semibold text-gray-800 mb-3">Quantity:</h3>
                                     <input 
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center"
                                     />
                                 </div>
                            </>
                        )}
                        
                        {/* Action Button */}
                        <div className="pt-6">
                            {product.stockType === 'on-hand' ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-green-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-green-700 transition-colors text-lg"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <button
                                    onClick={handleRequestQuote}
                                    className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg"
                                >
                                    Request a Quote
                                </button>
                            )}
                        </div>

                        {/* Customization Info */}
                        {product.customizationOptions.length > 0 && (
                             <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-md font-semibold text-gray-800 mb-2">Customization Available</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {product.customizationOptions.map(opt => (
                                        <li key={opt.type}>{opt.type}</li>
                                    ))}
                                </ul>
                                {product.stockType === 'custom-order' && <p className="text-sm text-gray-500 mt-2">Further details will be discussed during the quotation process.</p> }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
