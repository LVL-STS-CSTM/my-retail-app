import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FeaturedVideoContent } from '../types';

const FeaturedVideoManagement: React.FC = () => {
    const { featuredVideoContent, updateData } = useData();
    const [formData, setFormData] = useState<FeaturedVideoContent>(featuredVideoContent);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        setFormData(featuredVideoContent);
    }, [featuredVideoContent]);

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ 
            ...prev, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateData('featuredVideoContent', formData);
        showToast('Featured video settings saved!');
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500";

    return (
        <div className="relative">
             {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}
            <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="flex items-start">
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
                            <label htmlFor="isVisible" className="font-medium text-gray-700">Show Featured Video Section</label>
                            <p className="text-gray-500">Uncheck this to hide the section from the homepage.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                             <label htmlFor="youtubeVideoUrl" className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
                            <input
                                type="url"
                                name="youtubeVideoUrl"
                                id="youtubeVideoUrl"
                                value={formData.youtubeVideoUrl}
                                onChange={handleInputChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className={darkInputStyles}
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm font-semibold">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeaturedVideoManagement;