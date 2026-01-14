import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PlatformRating } from '../types';
import PlatformRatingFormModal from './PlatformRatingFormModal';
import { StarIcon, GoogleGIcon, FacebookIcon, YelpIcon, TrustpilotIcon, LinkedinIcon } from './icons';

const PlatformRatingManagement: React.FC = () => {
    const { platformRatings, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ratingToEdit, setRatingToEdit] = useState<PlatformRating | null>(null);

    const handleAddNew = () => {
        setRatingToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (rating: PlatformRating) => {
        setRatingToEdit(rating);
        setIsModalOpen(true);
    };

    const handleDelete = (ratingId: string) => {
        if (window.confirm('Are you sure you want to delete this platform rating?')) {
            const newRatings = platformRatings.filter(r => r.id !== ratingId);
            updateData('platformRatings', newRatings);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Platform Ratings ({platformRatings.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Add New Rating
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {platformRatings.map((rating) => (
                                <tr key={rating.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                                        {rating.platform === 'Google' && <GoogleGIcon className="w-5 h-5" />}
                                        {rating.platform === 'Facebook' && <FacebookIcon className="w-5 h-5 text-[#1877F2]" />}
                                        {rating.platform === 'Yelp' && <YelpIcon className="w-5 h-5 text-[#d32323]" />}
                                        {rating.platform === 'Trustpilot' && <TrustpilotIcon className="w-5 h-5 text-[#00b67a]" />}
                                        {rating.platform === 'LinkedIn' && <LinkedinIcon className="w-5 h-5 text-[#0077b5]" />}
                                        {rating.platform}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            {rating.rating.toFixed(1)}
                                            <StarIcon className="w-4 h-4 ml-1 text-yellow-400" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rating.reviewCount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <a href={rating.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">{rating.url}</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rating.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {rating.isVisible ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(rating)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(rating.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {platformRatings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No platform ratings found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <PlatformRatingFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    ratingToEdit={ratingToEdit}
                />
            )}
        </>
    );
};

export default PlatformRatingManagement;