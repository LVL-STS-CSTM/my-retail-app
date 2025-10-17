import React, { useState, useEffect } from 'react';
import { Partner } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface PartnerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    partnerToEdit: Partner | null;
}

const emptyPartner: Omit<Partner, 'id'> = {
    name: '',
    logoUrl: '',
};

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ isOpen, onClose, partnerToEdit }) => {
    const { partners, updateData } = useData();
    const [formData, setFormData] = useState<Partner | Omit<Partner, 'id'>>(partnerToEdit || emptyPartner);
    
    useEffect(() => {
        setFormData(partnerToEdit || emptyPartner);
    }, [partnerToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.logoUrl) {
            alert('Please fill out all fields.');
            return;
        }

        if (partnerToEdit && 'id' in formData) {
            const updatedPartners = partners.map(p => p.id === (formData as Partner).id ? formData as Partner : p);
            updateData('partners', updatedPartners);
        } else {
            const newPartner = { ...formData, id: `partner-${Date.now()}` };
            updateData('partners', [...partners, newPartner]);
        }
        onClose();
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true">
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{partnerToEdit ? 'Edit Partner' : 'Add New Partner'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Partner Name</label>
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
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input
                            type="url"
                            name="logoUrl"
                            id="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleInputChange}
                            required
                            placeholder="https://logo.clearbit.com/example.com"
                            className={darkInputStyles}
                        />
                    </div>
                    <footer className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Partner
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PartnerFormModal;