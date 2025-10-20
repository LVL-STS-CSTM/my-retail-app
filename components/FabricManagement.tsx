
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Material } from '../types';
import FabricFormModal from './FabricFormModal';

const FabricManagement: React.FC = () => {
    const { materials, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);

    const handleAddNew = () => {
        setMaterialToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (material: Material) => {
        setMaterialToEdit(material);
        setIsModalOpen(true);
    };

    const handleDelete = (materialId: string, materialName: string) => {
        if (window.confirm(`Are you sure you want to delete the material "${materialName}"?`)) {
            const newMaterials = materials.filter(m => m.id !== materialId);
            updateData('materials', newMaterials);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Materials ({materials.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Material
                    </button>
                </div>
                <div className="divide-y divide-gray-300">
                    {materials.map((material) => (
                        <div key={material.id} className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                            <img src={material.imageUrl} alt={material.name} className="w-24 h-24 object-cover rounded-md bg-gray-100 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{material.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {material.features.map(feature => (
                                        <span key={feature} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{material.description}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 space-x-2 self-center">
                                <button onClick={() => handleEdit(material)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(material.id, material.name)} className="text-red-600 hover:text-red-900 text-sm font-medium">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {materials.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No materials found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <FabricFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    materialToEdit={materialToEdit}
                />
            )}
        </>
    );
};

export default FabricManagement;
