import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Partner } from '../types';
import PartnerFormModal from './PartnerFormModal';

const PartnerManagement: React.FC = () => {
    const { partners, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);

    const handleAddNew = () => {
        setPartnerToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (partner: Partner) => {
        setPartnerToEdit(partner);
        setIsModalOpen(true);
    };

    const handleDelete = (partnerId: string, partnerName: string) => {
        if (window.confirm(`Are you sure you want to delete the partner "${partnerName}"?`)) {
            const newPartners = partners.filter(p => p.id !== partnerId);
            updateData('partners', newPartners);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Partners ({partners.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Partner
                    </button>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {partners.map((partner) => (
                        <div key={partner.id} className="border bg-white rounded-lg p-3 text-center space-y-2 shadow-sm">
                           <div className="h-20 flex items-center justify-center">
                             <img src={partner.logoUrl} alt={partner.name} className="max-h-16 max-w-full object-contain" />
                           </div>
                            <p className="text-sm font-medium text-gray-800 truncate">{partner.name}</p>
                            <div className="flex justify-center space-x-2 text-xs">
                                <button onClick={() => handleEdit(partner)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(partner.id, partner.name)} className="text-red-600 hover:text-red-900 font-medium">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                     {partners.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No partners found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <PartnerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    partnerToEdit={partnerToEdit}
                />
            )}
        </>
    );
};

export default PartnerManagement;