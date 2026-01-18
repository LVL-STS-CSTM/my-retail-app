
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductData } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { useContentData } from '../context/ContentContext';

const CollectionPage: React.FC = () => {
    const { collectionName } = useParams<{ collectionName: string }>();
    const { products } = useProductData();
    const { collectionInfo } = useContentData();

    const filteredProducts = products.filter(product => 
        collectionName === 'All' || product.collection.includes(collectionName!)
    );

    const currentCollection = collectionInfo[collectionName!] || {
        name: collectionName,
        description: `Browse all products in the ${collectionName} collection.`,
        imageUrl: 'https://source.unsplash.com/random/1600x400?fabric'
    };

    return (
        <div className="bg-white font-sans">
            {/* Collection Header */}
            <section className="relative bg-gray-800 text-white py-20 md:py-32">
                 <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url(${currentCollection.imageUrl})` }}
                ></div>
                <div className="relative text-center max-w-4xl mx-auto px-4">
                    <h1 className="font-heading text-5xl font-bold">{currentCollection.name}</h1>
                    <p className="mt-4 text-lg text-gray-200">{currentCollection.description}</p>
                </div>
            </section>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                        <p className="mt-4 text-gray-500">There are currently no products in the {collectionName} collection.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollectionPage;
