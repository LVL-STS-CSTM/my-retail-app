
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContentData } from '../context/ContentContext';
import { useProductData } from '../context/ProductContext';
import ProductCard from './ProductCard';

const MaterialDetail: React.FC = () => {
    const { materialId } = useParams<{ materialId: string }>();
    const { materials } = useContentData();
    const { products } = useProductData();

    const material = materials.find(m => m.id === materialId);
    const relatedProducts = products.filter(p => p.materialId === materialId);

    if (!material) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl">Material not found.</h2>
                 <Link to="/" className="text-indigo-600 mt-4 inline-block">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <section className="bg-gray-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="font-heading text-5xl font-bold tracking-tight">{material.name}</h1>
                    <p className="mt-4 text-xl text-gray-300">{material.description}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Details Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                             <h2 className="text-3xl font-bold text-gray-800 mb-4">Fabric Properties</h2>
                             <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {Object.entries(material.properties).map(([key, value]) => (
                                    <div key={key} className="flex items-center text-lg">
                                        <span className="text-indigo-500 mr-3">&#10003;</span>
                                        <span className="capitalize font-semibold">{key.replace(/_/g, ' ')}:</span>
                                        <span className="ml-2 text-gray-700">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                             <h2 className="text-3xl font-bold text-gray-800 mb-4">Best For</h2>
                             <div className="flex flex-wrap gap-3">
                                {material.bestFor.map(use => (
                                    <span key={use} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium text-sm">{use}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="lg:col-span-1">
                         <img src={material.imageUrl} alt={material.name} className="w-full h-auto rounded-lg shadow-xl object-cover"/>
                    </div>
                </div>

                 {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Products Available in {material.name}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialDetail;
