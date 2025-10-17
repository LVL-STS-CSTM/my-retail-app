import React, { useState, useEffect } from 'react';
import { CommunityPost } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface CommunityPostFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    postToEdit: CommunityPost | null;
}

const emptyPost: Omit<CommunityPost, 'id'> = {
    imageUrl: '',
    caption: '',
    author: '',
    source: 'Instagram',
    taggedProductId: '',
    isVisible: true,
};

const sources: CommunityPost['source'][] = ['Instagram', 'Facebook', 'Client Submission'];

const CommunityPostFormModal: React.FC<CommunityPostFormModalProps> = ({ isOpen, onClose, postToEdit }) => {
    const { communityPosts, products, updateData } = useData();
    const [formData, setFormData] = useState<CommunityPost | Omit<CommunityPost, 'id'>>(postToEdit || emptyPost);
    
    useEffect(() => {
        setFormData(postToEdit || emptyPost);
    }, [postToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl || !formData.caption || !formData.author) {
            alert('Image URL, Caption, and Author are required fields.');
            return;
        }
        
        const dataToSave = {
            ...formData,
            taggedProductId: formData.taggedProductId || undefined,
        }

        if (postToEdit && 'id' in formData) {
            const updatedPosts = communityPosts.map(p => p.id === (dataToSave as CommunityPost).id ? dataToSave as CommunityPost : p);
            updateData('communityPosts', updatedPosts);
        } else {
            const newPost = { ...dataToSave, id: `comm-${Date.now()}` };
            updateData('communityPosts', [...communityPosts, newPost]);
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{postToEdit ? 'Edit Post' : 'Add New Post'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            required
                            autoFocus
                            placeholder="https://images.pexels.com/..."
                            className={darkInputStyles}
                        />
                    </div>
                     <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                        <textarea
                            name="caption"
                            id="caption"
                            rows={3}
                            value={formData.caption}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                type="text"
                                name="author"
                                id="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                                placeholder="@username or Team Name"
                                className={darkInputStyles}
                            />
                        </div>
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
                            <select
                                name="source"
                                id="source"
                                value={formData.source}
                                onChange={handleInputChange}
                                className={darkInputStyles}
                            >
                                {sources.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="taggedProductId" className="block text-sm font-medium text-gray-700">Tagged Product (Optional)</label>
                        <select
                            name="taggedProductId"
                            id="taggedProductId"
                            value={formData.taggedProductId || ''}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        >
                            <option value="">-- No Product --</option>
                            {products.sort((a,b) => a.name.localeCompare(b.name)).map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
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
                            <label htmlFor="isVisible" className="font-medium text-gray-700">Visible on Community Page</label>
                            <p className="text-gray-500">Uncheck this to hide the post from the public page.</p>
                        </div>
                    </div>

                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Post
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CommunityPostFormModal;