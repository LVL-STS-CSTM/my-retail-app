import React, { useState, useEffect } from 'react';
import { BrandReview } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon, StarIcon } from './icons';

interface BrandReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviewToEdit: BrandReview | Partial<BrandReview> | null;
}

const emptyReview: Omit<BrandReview, 'id'> = {
    author: '',
    quote: '',
    rating: 5,
    isVisible: true,
    imageUrl: '',
};

const BrandReviewFormModal: React.FC<BrandReviewFormModalProps> = ({ isOpen, onClose, reviewToEdit }) => {
    const { brandReviews, updateData } = useData();
    const [formData, setFormData] = useState<BrandReview | Partial<BrandReview>>(reviewToEdit || emptyReview);
    
    useEffect(() => {
        // When opening the form for a new item, ensure it has all default fields
        const initialData = reviewToEdit 
            ? { ...emptyReview, ...reviewToEdit } 
            : emptyReview;
        setFormData(initialData);
    }, [reviewToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleRatingChange = (newRating: number) => {
        setFormData(prev => ({...prev, rating: newRating }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.author || !formData.quote) {
            alert('Author and Quote fields cannot be empty.');
            return;
        }

        const dataToSave = {
            ...formData,
            rating: Number(formData.rating || 5),
            imageUrl: formData.imageUrl || undefined,
            isVisible: formData.isVisible ?? true, // Ensure isVisible is a boolean
        };

        if (reviewToEdit && 'id' in dataToSave && dataToSave.id) {
            const updatedReviews = brandReviews.map(r => r.id === (dataToSave as BrandReview).id ? dataToSave as BrandReview : r);
            updateData('brandReviews', updatedReviews);
        } else {
            const newReview = { ...dataToSave, id: `review-${Date.now()}` } as BrandReview;
            updateData('brandReviews', [...brandReviews, newReview]);
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{reviewToEdit && 'id' in reviewToEdit ? 'Edit Review' : 'Add New Review'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                     <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            id="author"
                            value={formData.author || ''}
                            onChange={handleInputChange}
                            required
                            autoFocus
                            placeholder="e.g., John Doe, CEO of Example Inc."
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Author Image URL (Optional)</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl || ''}
                            onChange={handleInputChange}
                            placeholder="https://images.pexels.com/..."
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-gray-700">Quote</label>
                        <textarea
                            name="quote"
                            id="quote"
                            rows={4}
                            value={formData.quote || ''}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex items-center space-x-2">
                           {[1, 2, 3, 4, 5].map(star => (
                               <button 
                                 type="button" 
                                 key={star} 
                                 onClick={() => handleRatingChange(star)}
                                 className="text-2xl transition-transform transform hover:scale-110"
                               >
                                 <StarIcon className={(formData.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}/>
                               </button>
                           ))}
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isVisible"
                                name="isVisible"
                                type="checkbox"
                                checked={formData.isVisible || false}
                                onChange={handleInputChange}
                                className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isVisible" className="font-medium text-gray-700">Visible on Community Page</label>
                            <p className="text-gray-500">Uncheck this to hide the review from the public page.</p>
                        </div>
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                            Save Review
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default BrandReviewFormModal;