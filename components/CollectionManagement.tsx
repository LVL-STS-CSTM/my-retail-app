import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import CollectionFormModal from './CollectionFormModal';

const CollectionManagement: React.FC = () => {
    const { collections, products, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState<string | null>(null);

    const handleAddNew = () => {
        setCollectionToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (collectionName: string) => {
        setCollectionToEdit(collectionName);
        setIsModalOpen(true);
    };

    const handleDelete = (collectionName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${collectionName}" collection? This will remove the collection name from all associated products.`)) {
            // Remove the collection itself
            const newCollections = collections.filter(c => c !== collectionName);
            updateData('collections', newCollections);
            
            // Un-assign products from this collection
            const updatedProducts = products.map(p => {
                if (p.categoryGroup === collectionName) {
                    return { ...p, categoryGroup: '' }; // or a default value
                }
                return p;
            });
            updateData('products', updatedProducts);
        }
    };

    const productCounts = useMemo(() => {
        return collections.reduce((acc, collection) => {
            acc[collection] = products.filter(p => p.categoryGroup === collection).length;
            return acc;
        }, {} as Record<string, number>);
    }, [products, collections]);

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Collections ({collections.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Collection
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {collections.map((collection) => (
                                <tr key={collection}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{productCounts[collection] || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(collection)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(collection)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {collections.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-10 text-gray-500">
                                        No collections found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <CollectionFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    collectionToEdit={collectionToEdit}
                />
            )}
        </>
    );
};

export default CollectionManagement;