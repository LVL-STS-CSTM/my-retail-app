import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { HowWeWorkSection } from '../types';

/**
 * @description A reusable form component for editing a single "How We Work" section.
 */
const SectionEditor: React.FC<{
    sectionData: HowWeWorkSection;
    showToast: (message: string) => void;
}> = ({ sectionData, showToast }) => {
    const { howWeWorkSections, updateData } = useData();
    const [formData, setFormData] = useState<HowWeWorkSection>(sectionData);

    useEffect(() => {
        setFormData(sectionData);
    }, [sectionData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedSections = howWeWorkSections.map(s => s.id === formData.id ? formData : s);
        updateData('howWeWorkSections', updatedSections);
        showToast(`'${formData.title}' section saved!`);
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500";

    return (
        <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{sectionData.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor={`title-${formData.id}`} className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id={`title-${formData.id}`}
                        value={formData.title}
                        onChange={handleInputChange}
                        className={darkInputStyles}
                    />
                </div>
                <div>
                    <label htmlFor={`description-${formData.id}`} className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id={`description-${formData.id}`}
                        rows={5}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={darkInputStyles}
                    />
                </div>
                <div>
                    <label htmlFor={`imageUrl-${formData.id}`} className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        id={`imageUrl-${formData.id}`}
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className={darkInputStyles}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f] text-sm font-semibold">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

/**
 * @description The main management component for editing the "How We Work" page content.
 */
const HowWeWorkManagement: React.FC = () => {
    const { howWeWorkSections } = useData();
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    if (howWeWorkSections.length === 0) {
        return <div className="text-center p-8">Loading content...</div>;
    }

    return (
        <div className="space-y-6 relative">
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}
            {howWeWorkSections.map(section => (
                <SectionEditor key={section.id} sectionData={section} showToast={showToast} />
            ))}
        </div>
    );
};

export default HowWeWorkManagement;