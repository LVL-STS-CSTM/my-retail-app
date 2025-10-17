import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BrandReview } from '../types';
import BrandReviewFormModal from './BrandReviewFormModal';
import { StarIcon, SparklesIcon } from './icons';
import ReviewGenerationModal from './ReviewGenerationModal';

const BrandReviewManagement: React.FC = () => {
    const { brandReviews, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState<BrandReview | Partial<BrandReview> | null>(null);

    const handleAddNew = () => {
        setReviewToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenAIGenerator = () => {
        setIsGenerationModalOpen(true);
    };

    const handleReviewGenerated = (generatedReview: { author: string; quote: string }) => {
        setIsGenerationModalOpen(false); // Close the generation modal
        // Create a partial review object to pre-fill the form
        const newReviewData: Partial<BrandReview> = {
            ...generatedReview,
            rating: 5, // Default to 5 stars
            isVisible: true,
        };
        setReviewToEdit(newReviewData);
        setIsModalOpen(true); // Open the main form modal
    };

    const handleEdit = (review: BrandReview) => {
        setReviewToEdit(review);
        setIsModalOpen(true);
    };

    const handleDelete = (reviewId: string) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const newReviews = brandReviews.filter(r => r.id !== reviewId);
            updateData('brandReviews', newReviews);
        }
    };

    const toggleVisibility = (review: BrandReview) => {
        const updatedReview = { ...review, isVisible: !review.isVisible };
        const newReviews = brandReviews.map(r => r.id === review.id ? updatedReview : r);
        updateData('brandReviews', newReviews);
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Manage Brand Reviews ({brandReviews.length})</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOpenAIGenerator}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            Add with AI
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Add New Review
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {brandReviews.map((review) => (
                                <tr key={review.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={review.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`} alt={review.author} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{review.author}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600"><p className="w-80 truncate">{review.quote}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button onClick={() => toggleVisibility(review)} className={`px-2 py-1 text-xs font-semibold rounded-full ${review.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {review.isVisible ? 'Yes' : 'No'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(review)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(review.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {brandReviews.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No reviews found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <BrandReviewFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    reviewToEdit={reviewToEdit}
                />
            )}
            {isGenerationModalOpen && (
                <ReviewGenerationModal
                    isOpen={isGenerationModalOpen}
                    onClose={() => setIsGenerationModalOpen(false)}
                    onReviewGenerated={handleReviewGenerated}
                />
            )}
        </>
    );
};

export default BrandReviewManagement;