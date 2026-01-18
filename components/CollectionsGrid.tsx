
import React from 'react';
import { Link } from 'react-router-dom';
import { useContentData } from '../context/ContentContext';


const CollectionsGrid: React.FC = () => {
    const { collections, collectionImages } = useContentData();
    const displayCollections = collections.slice(0, 3); // Show max 3 collections

    return (
        <section className="bg-gray-50 py-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-gray-800">Our Collections</h2>
                    <p className="mt-4 text-lg text-gray-600">Curated styles for every need.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayCollections.map((collection, index) => (
                        <Link 
                            key={collection}
                            to={`/collection/${collection}`}
                            className={`relative rounded-lg overflow-hidden h-96 shadow-lg group transform hover:scale-105 transition-transform duration-300 ${index === 0 ? 'md:col-span-2' : ''}`}
                        >
                            <img 
                                src={collectionImages[collection] || `https://source.unsplash.com/random/800x600?${collection}`}
                                alt={collection}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white text-3xl font-bold font-heading">{collection}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CollectionsGrid;
