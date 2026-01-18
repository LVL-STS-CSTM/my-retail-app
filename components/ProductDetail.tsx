
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductData } from '../context/ProductContext';
import { useContentData } from '../context/ContentContext';

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products } = useProductData();
    const { materials } = useContentData();

    const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<string | null>(null);

    // Effect to set defaults when product loads
    useState(() => {
        if (product) {
            const defaultColor = product.colors.length > 0 ? product.colors[0].name : null;
            setSelectedColor(defaultColor);
            setSelectedSize(product.sizes.length > 0 ? product.sizes[0].name : null);
            if (defaultColor && product.imageUrls[defaultColor]?.length > 0) {
                setMainImage(product.imageUrls[defaultColor][0]);
            }
        }
    });
    
    const material = useMemo(() => materials.find(m => m.id === product?.materialId), [materials, product]);

    const handleColorSelect = (colorName: string) => {
        setSelectedColor(colorName);
        if (product && product.imageUrls[colorName]?.length > 0) {
            setMainImage(product.imageUrls[colorName][0]);
        }
    };

    if (!product) {
        return <div className="text-center py-20 font-sans">Product not found.</div>;
    }

    const finalPrice = (
        product.basePrice +
        (product.sizes.find(s => s.name === selectedSize)?.additionalPrice || 0)
    ).toFixed(2);

    const availableImages = selectedColor ? product.imageUrls[selectedColor] || [] : [];

    return (
        <div className="bg-white font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image gallery */}
                    <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg shadow-inner overflow-hidden">
                            <img 
                                src={mainImage || 'https://via.placeholder.com/600x600.png?text=Select+a+color'}
                                alt={`${product.name} ${selectedColor}`}
                                className="w-full h-auto object-cover transition-all duration-300"
                                style={{aspectRatio: '1/1'}}
                            />
                        </div>
                        {availableImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {availableImages.map((img, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setMainImage(img)} 
                                        className={`rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`}>
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-6">
                        <h1 className="font-heading text-4xl font-bold text-gray-900">{product.name}</h1>
                        
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold text-indigo-600">${finalPrice}</span>
                            {product.sizes.find(s => s.name === selectedSize)?.additionalPrice > 0 &&
                                <span className="text-lg text-gray-500">(${product.basePrice.toFixed(2)} base)</span>
                            }
                        </div>

                        <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

                        {/* Color Selector */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Color: <span className="font-normal">{selectedColor}</span></h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map(color => (
                                    <button 
                                        key={color.name} 
                                        onClick={() => handleColorSelect(color.name)} 
                                        className={`w-10 h-10 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-indigo-500' : 'ring-1 ring-gray-300'}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div>
                             <h3 className="text-md font-semibold text-gray-800 mb-3">Size: <span className="font-normal">{selectedSize}</span></h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button 
                                        key={size.name} 
                                        onClick={() => setSelectedSize(size.name)} 
                                        className={`px-5 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSize === size.name ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                        {size.name}
                                        {size.additionalPrice > 0 && <span className="text-xs ml-1"> (+${size.additionalPrice.toFixed(2)})</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <button className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg">Add to Quote</button>
                        
                         {/* Material Info */}
                        {material && (
                             <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-md font-semibold text-gray-800 mb-2">Fabric Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{material.name}</p>
                                        <p className="text-sm text-gray-600">{material.properties.composition}</p>
                                    </div>
                                    <Link to={`/materials/${material.id}`} className="text-indigo-600 hover:underline font-medium text-sm">View Details &rarr;</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
