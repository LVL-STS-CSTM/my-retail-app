
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContentData } from '../context/ContentContext';
import { useProductData } from '../context/ProductContext';
import ProductCard from './ProductCard';

const MaterialPage: React.FC = () => {
    const { materialId } = useParams<{ materialId: string }>();
    const { materials } = useContentData();
    const { products } = useProductData();

    const material = materials.find(m => m.id === materialId);
    const relatedProducts = products.filter(p => p.materialId === materialId);

    if (!material) {
        return <div className="text-center py-20">Material not found.</div>;
    }

    return (
        <div className="bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Material Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-lg shadow-md">
                    <div className="rounded-lg overflow-hidden">
                        <img src={material.imageUrl} alt={material.name} className="w-full h-auto object-cover" style={{maxHeight: '500px'}}/>
                    </div>
                    <div className="space-y-6">
                        <h1 className="font-heading text-4xl font-bold text-gray-900">{material.name}</h1>
                        <p className="text-lg text-gray-700">{material.description}</p>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fabric Properties</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="font-semibold text-gray-600">Composition:</div>
                                <div className="text-gray-800">{material.properties.composition}</div>
                                
                                <div className="font-semibold text-gray-600">Weight (GSM):</div>
                                <div className="text-gray-800">{material.properties.weight_gsm} g/m²</div>

                                <div className="font-semibold text-gray-600">Weave:</div>
                                <div className="text-gray-800">{material.properties.weave}</div>

                                <div className="font-semibold text-gray-600">Certifications:</div>
                                <div className="text-gray-800">{material.properties.certifications}</div>
                            </div>
                        </div>
                         <div className="pt-6 border-t">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Best For</h3>
                            <div className="flex flex-wrap gap-3">
                                {material.bestFor.map(item => (
                                    <span key={item} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-heading font-bold text-center text-gray-800 mb-12">Products Available in {material.name}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
                 {relatedProducts.length === 0 && (
                    <div className="text-center py-16 mt-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">No products currently use this material.</h3>
                        <p className="text-gray-600 mt-2">Check back soon, or browse other collections!</p>
                        <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700">Go Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialPage;
