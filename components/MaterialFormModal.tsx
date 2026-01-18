import React, { useState, useEffect } from 'react';
import { Material } from '../types';
import { useContentData } from '../context/ContentContext';

interface MaterialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: Material) => void;
    material: Material | null;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, onSave, material }) => {
    const { materials, updateContent } = useContentData();
    const [formData, setFormData] = useState<Omit<Material, 'id'>>({
        name: '',
        description: '',
        imageUrl: '',
        properties: {
            composition: '',
            weight_gsm: 0,
            weave: '',
            certifications: '',
        },
        bestFor: [],
    });

    useEffect(() => {
        if (material) {
            setFormData({
                name: material.name,
                description: material.description,
                imageUrl: material.imageUrl,
                properties: { ...material.properties },
                bestFor: [...material.bestFor],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                imageUrl: '',
                properties: {
                    composition: '',
                    weight_gsm: 0,
                    weave: '',
                    certifications: '',
                },
                bestFor: [],
            });
        }
    }, [material, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            properties: {
                ...prev.properties,
                [name]: type === 'number' ? parseInt(value, 10) : value,
            },
        }));
    };

    const handleBestForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Split by comma and trim whitespace
        const bestForArray = value.split(',').map(item => item.trim());
        setFormData(prev => ({ ...prev, bestFor: bestForArray }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const materialToSave: Material = material
            ? { ...formData, id: material.id }
            : { ...formData, id: `material_${Date.now()}` };

        const newMaterials = material
            ? materials.map(m => (m.id === materialToSave.id ? materialToSave : m))
            : [...materials, materialToSave];

        const success = await updateContent('materials', newMaterials);
        if (success) {
            onSave(materialToSave);
            onClose();
        } else {
            alert('Failed to save material. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">{material ? 'Edit Material' : 'Add New Material'}</h2>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-4 flex-grow">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Material Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        
                        <div className="pt-4 border-t">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Fabric Properties</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="composition" className="block text-sm font-medium text-gray-700">Composition</label>
                                    <input type="text" name="composition" id="composition" value={formData.properties.composition} onChange={handlePropertyChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="weight_gsm" className="block text-sm font-medium text-gray-700">Weight (GSM)</label>
                                    <input type="number" name="weight_gsm" id="weight_gsm" value={formData.properties.weight_gsm} onChange={handlePropertyChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="weave" className="block text-sm font-medium text-gray-700">Weave</label>
                                    <input type="text" name="weave" id="weave" value={formData.properties.weave} onChange={handlePropertyChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                 <div>
                                    <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">Certifications</label>
                                    <input type="text" name="certifications" id="certifications" value={formData.properties.certifications} onChange={handlePropertyChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                             <label htmlFor="bestFor" className="block text-sm font-medium text-gray-700">Best For (comma-separated)</label>
                             <input type="text" name="bestFor" id="bestFor" value={formData.bestFor.join(', ')} onChange={handleBestForChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="e.g. Sportswear, T-shirts, Hoodies" />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Material</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialFormModal;
