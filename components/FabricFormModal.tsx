
import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Material } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon, PlusIcon } from './icons';

interface MaterialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    materialToEdit: Material | null;
}

const emptyMaterial: Omit<Material, 'id'> = {
    name: '',
    imageUrl: '',
    description: '',
    features: [],
    careImageUrl: '',
};

const FabricFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, materialToEdit }) => {
    const { materials, updateData } = useData();
    const [formData, setFormData] = useState<Material | Omit<Material, 'id'>>(materialToEdit || emptyMaterial);
    const [featureInput, setFeatureInput] = useState('');
    
    useEffect(() => {
        setFormData(materialToEdit || emptyMaterial);
    }, [materialToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddFeature = () => {
        if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
            setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const handleFeatureInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFeature();
        }
    };

    const handleRemoveFeature = (featureToRemove: string) => {
        setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== featureToRemove) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.imageUrl) {
            alert('Please fill out all fields.');
            return;
        }

        const dataToSave = {
            ...formData,
            careImageUrl: formData.careImageUrl || undefined
        };

        if (materialToEdit && 'id' in formData) {
            const updatedMaterials = materials.map(m => m.id === (dataToSave as Material).id ? dataToSave as Material : m);
            updateData('materials', updatedMaterials);
        } else {
            const newMaterial = { ...dataToSave, id: `fabric-${Date.now()}` };
            updateData('materials', [...materials, newMaterial]);
        }
        onClose();
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{materialToEdit ? 'Edit Material' : 'Add New Material'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Material Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            autoFocus
                            className={darkInputStyles}
                        />
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            required
                            placeholder="https://images.pexels.com/..."
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="careImageUrl" className="block text-sm font-medium text-gray-700">Care Instructions Image URL (Optional)</label>
                        <input
                            type="url"
                            name="careImageUrl"
                            id="careImageUrl"
                            value={formData.careImageUrl || ''}
                            onChange={handleInputChange}
                            placeholder="https://.../care-instructions.png"
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    {/* Feature Management UI */}
                    <div className="p-3 border rounded-md">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                        <div className="flex gap-2 mb-2 items-center">
                            <input 
                                value={featureInput} 
                                onChange={e => setFeatureInput(e.target.value)} 
                                onKeyDown={handleFeatureInputKeyDown}
                                placeholder="e.g., Moisture-Wicking" 
                                className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            />
                            <button type="button" onClick={handleAddFeature} className="px-3 py-2 mt-1 bg-gray-200 rounded-md hover:bg-gray-300">
                                <PlusIcon className="w-5 h-5"/>
                            </button>
                        </div>
                         <div className="flex flex-wrap gap-2">
                            {formData.features.map(feature => (
                                <span key={feature} className="flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium pl-3 pr-2 py-1 rounded-full">
                                    {feature}
                                    <button type="button" onClick={() => handleRemoveFeature(feature)} className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-200">
                                        <CloseIcon className="w-3 h-3"/>
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Material
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default FabricFormModal;
