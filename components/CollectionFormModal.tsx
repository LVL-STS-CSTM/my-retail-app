import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    collectionToEdit: string | null;
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({ isOpen, onClose, collectionToEdit }) => {
    const { collections, products, updateData } = useData();
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(collectionToEdit || '');
        }
    }, [collectionToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            alert('Collection name cannot be empty.');
            return;
        }

        if (collections.includes(trimmedName) && trimmedName !== collectionToEdit) {
            alert('This collection name already exists.');
            return;
        }

        if (collectionToEdit) {
            // Update the collection name in the collections list
            const updatedCollections = collections.map(c => c === collectionToEdit ? trimmedName : c);
            updateData('collections', updatedCollections);

            // Update all products that used the old collection name
            const updatedProducts = products.map(p => {
                if (p.categoryGroup === collectionToEdit) {
                    return { ...p, categoryGroup: trimmedName };
                }
                return p;
            });
            updateData('products', updatedProducts);

        } else {
            // Add the new collection
            const newCollections = [...collections, trimmedName];
            updateData('collections', newCollections);
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true">
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{collectionToEdit ? 'Edit Collection' : 'Add New Collection'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="collection-name" className="block text-sm font-medium text-gray-700">Collection Name</label>
                        <input
                            type="text"
                            id="collection-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400"
                        />
                    </div>
                    <footer className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Collection
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormModal;