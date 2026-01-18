
import React, { useState } from 'react';
import { Material } from '../types';
import MaterialFormModal from './MaterialFormModal';
import { useContentData } from '../context/ContentContext';

const MaterialManagement: React.FC = () => {
    const { materials, updateContent } = useContentData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const openModal = (material: Material | null = null) => {
        setSelectedMaterial(material);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMaterial(null);
    };

    const handleSave = (material: Material) => {
        // The modal now handles the update logic via context
        closeModal();
    };

    const handleDelete = async (materialId: string) => {
        if (window.confirm('Are you sure you want to delete this material? This could affect products using it.')) {
            const newMaterials = materials.filter(m => m.id !== materialId);
            const success = await updateContent('materials', newMaterials);
            if (!success) {
                alert('Failed to delete material. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Fabric Materials</h3>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">+ Add Material</button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {materials.map(material => (
                    <div key={material.id} className="p-3 border rounded-md flex justify-between items-start hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                            <img src={material.imageUrl} alt={material.name} className="w-16 h-16 object-cover rounded-md bg-gray-200" />
                            <div>
                                <h4 className="font-semibold text-gray-800">{material.name}</h4>
                                <p className="text-sm text-gray-600 max-w-md">{material.description.substring(0,100)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                            <button onClick={() => openModal(material)} className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                            <button onClick={() => handleDelete(material.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                ))}
                 {materials.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No materials defined. Add a fabric material to get started.
                    </div>
                )}
            </div>
            {isModalOpen && (
                <MaterialFormModal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    onSave={handleSave} 
                    material={selectedMaterial} 
                />
            )}
        </div>
    );
};

export default MaterialManagement;
