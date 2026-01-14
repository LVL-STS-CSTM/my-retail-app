
import React, { useState, useEffect, useMemo } from 'react';
import { HeroContent, Product } from '../types';
// FIX: Use useData hook instead of non-existent hooks
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface HeroFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    heroToEdit: HeroContent | null;
    showToast: (message: string) => void;
}

const emptyHero: Omit<HeroContent, 'id' | 'displayOrder'> = {
    title: '',
    description: '',
    mediaSrc: '',
    mediaType: 'video',
    buttonText: '',
    buttonCollectionLink: '',
    featuredProductsTitle: '',
    featuredProductIds: [],
};

const HeroFormModal: React.FC<HeroFormModalProps> = ({ isOpen, onClose, heroToEdit, showToast }) => {
    // FIX: Use useData hook
    const { heroContents, collections, products, updateData } = useData();

    // FIX: Simplified functions as DataContext does not have granular updaters
    const addHeroContent = (newHero: Omit<HeroContent, 'id' | 'displayOrder'>) => {
        const newHeroWithId: HeroContent = {
            ...newHero,
            id: `hero-${Date.now()}`,
            displayOrder: heroContents.length,
        }
        updateData('heroContents', [...heroContents, newHeroWithId]);
    }
    const updateHeroContent = (updatedHero: HeroContent) => {
        const newHeroes = heroContents.map(h => h.id === updatedHero.id ? updatedHero : h);
        updateData('heroContents', newHeroes);
    }

    const [formData, setFormData] = useState<HeroContent | Omit<HeroContent, 'id' | 'displayOrder'>>(emptyHero);
    
    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.category));
        return Array.from(uniqueCategories).sort();
    }, [products]);

    useEffect(() => {
        if (heroToEdit) {
            setFormData({
                ...emptyHero, // Provides defaults for all fields, ensuring none are undefined
                ...heroToEdit, // Overrides with actual data
            });
        } else {
            setFormData(emptyHero);
        }
    }, [heroToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFeaturedProductsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Add explicit type to the 'option' parameter to resolve type error.
        const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({ ...prev, featuredProductIds: selectedIds }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.mediaSrc) {
            alert('Please fill out Title, Description, and Media URL.');
            return;
        }
        
        // If there's button text, a link must be selected
        if (formData.buttonText && !formData.buttonCollectionLink) {
            alert('Please select a collection to link the button to, or remove the button text.');
            return;
        }

        if (heroToEdit && 'id' in formData) {
            updateHeroContent(formData as HeroContent);
            showToast('Banner updated successfully!');
        } else {
            addHeroContent(formData as Omit<HeroContent, 'id' | 'displayOrder'>);
            showToast('Banner added successfully!');
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{heroToEdit ? 'Edit Hero Banner' : 'Add New Hero Banner'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            autoFocus
                            className={darkInputStyles}
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">Media Type</label>
                             <select
                                name="mediaType"
                                id="mediaType"
                                value={formData.mediaType}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            >
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                                <option value="gif">GIF</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="mediaSrc" className="block text-sm font-medium text-gray-700">Media URL</label>
                            <input
                                type="url"
                                name="mediaSrc"
                                id="mediaSrc"
                                value={formData.mediaSrc}
                                onChange={handleInputChange}
                                required
                                placeholder="https://.../media.mp4 or .jpg"
                                className={darkInputStyles}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">Button Text (Optional)</label>
                            <input
                                type="text"
                                name="buttonText"
                                id="buttonText"
                                value={formData.buttonText || ''}
                                onChange={handleInputChange}
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="buttonCollectionLink" className="block text-sm font-medium text-gray-700">Button Links To</label>
                            <select
                                name="buttonCollectionLink"
                                id="buttonCollectionLink"
                                value={formData.buttonCollectionLink || ''}
                                onChange={handleInputChange}
                                className={darkInputStyles}
                            >
                                <option value="">-- No Link --</option>
                                <optgroup label="Collections (Groups)">
                                    {collections.map(collection => (
                                        <option key={collection} value={collection}>{collection}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Specific Categories">
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    </div>
                    
                    {/* Featured Products Section */}
                    <div className="space-y-4 border-t pt-4">
                         <div>
                            <label htmlFor="featuredProductsTitle" className="block text-sm font-medium text-gray-700">Featured Products Section Title (Optional)</label>
                            <input
                                type="text"
                                name="featuredProductsTitle"
                                id="featuredProductsTitle"
                                value={formData.featuredProductsTitle || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., Our Bestsellers"
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="featuredProductIds" className="block text-sm font-medium text-gray-700">Featured Products (Hold Ctrl/Cmd to select multiple)</label>
                            <select
                                multiple
                                name="featuredProductIds"
                                id="featuredProductIds"
                                value={formData.featuredProductIds || []}
                                onChange={handleFeaturedProductsChange}
                                className={`${darkInputStyles} h-40`}
                            >
                                {products.sort((a,b) => a.name.localeCompare(b.name)).map((product: Product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Banner
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default HeroFormModal;
