import React, { useState, useEffect } from 'react';
import { PlatformRating, PlatformName } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface PlatformRatingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    ratingToEdit: PlatformRating | null;
}

const emptyRating: Omit<PlatformRating, 'id'> = {
    platform: 'Google',
    rating: 5.0,
    reviewCount: 0,
    url: '',
    isVisible: true,
};

const platformNames: PlatformName[] = ['Google', 'Facebook', 'Yelp', 'Trustpilot', 'LinkedIn'];

const PlatformRatingFormModal: React.FC<PlatformRatingFormModalProps> = ({ isOpen, onClose, ratingToEdit }) => {
    const { platformRatings, updateData } = useData();
    const [formData, setFormData] = useState<PlatformRating | Omit<PlatformRating, 'id'>>(ratingToEdit || emptyRating);
    
    useEffect(() => {
        setFormData(ratingToEdit || emptyRating);
    }, [ratingToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.platform || !formData.url) {
            alert('Platform and URL fields cannot be empty.');
            return;
        }

        if (ratingToEdit && 'id' in formData) {
            const updatedRatings = platformRatings.map(r => r.id === (formData as PlatformRating).id ? formData as PlatformRating : r);
            updateData('platformRatings', updatedRatings);
        } else {
            const newRating = { ...formData, id: `pr-${Date.now()}` };
            updateData('platformRatings', [...platformRatings, newRating]);
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{ratingToEdit ? 'Edit Rating' : 'Add New Rating'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
                            <select
                                name="platform"
                                id="platform"
                                value={formData.platform}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            >
                                {platformNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1.0 - 5.0)</label>
                            <input
                                type="number"
                                name="rating"
                                id="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max="5"
                                step="0.1"
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700">Review Count</label>
                            <input
                                type="number"
                                name="reviewCount"
                                id="reviewCount"
                                value={formData.reviewCount}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className={darkInputStyles}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">Reviews URL</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            required
                            placeholder="https://www.google.com/reviews/..."
                            className={darkInputStyles}
                        />
                    </div>
                     <div className="flex items-start pt-2">
                        <div className="flex items-center h-5">
                            <input
                                id="isVisible"
                                name="isVisible"
                                type="checkbox"
                                checked={formData.isVisible}
                                onChange={handleInputChange}
                                className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isVisible" className="font-medium text-gray-700">Visible on Homepage</label>
                            <p className="text-gray-500">Uncheck this to hide the rating from the public page.</p>
                        </div>
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                            Save Rating
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PlatformRatingFormModal;