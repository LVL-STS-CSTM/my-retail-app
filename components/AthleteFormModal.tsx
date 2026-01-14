import React, { useState, useEffect } from 'react';
import { Athlete } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface AthleteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    athleteToEdit: Athlete | null;
}

const emptyAthlete: Omit<Athlete, 'id'> = {
    name: '',
    sport: '',
    imageUrl: '',
    bio: '',
    instagramHandle: '',
};

const AthleteFormModal: React.FC<AthleteFormModalProps> = ({ isOpen, onClose, athleteToEdit }) => {
    const { athletes, updateData } = useData();
    const [formData, setFormData] = useState<Athlete | Omit<Athlete, 'id'>>(athleteToEdit || emptyAthlete);
    
    useEffect(() => {
        setFormData(athleteToEdit || emptyAthlete);
    }, [athleteToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.sport || !formData.imageUrl || !formData.bio) {
            alert('Please fill out all required fields: Name, Sport, Image URL, and Bio.');
            return;
        }

        const dataToSave = {
            ...formData,
            instagramHandle: formData.instagramHandle || undefined,
        }

        if (athleteToEdit && 'id' in formData) {
            const updatedAthletes = athletes.map(a => a.id === (dataToSave as Athlete).id ? dataToSave as Athlete : a);
            updateData('athletes', updatedAthletes);
        } else {
            const newAthlete = { ...dataToSave, id: `athlete-${Date.now()}` };
            updateData('athletes', [...athletes, newAthlete]);
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{athleteToEdit ? 'Edit Athlete' : 'Add New Athlete'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Athlete Name</label>
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
                            <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport</label>
                            <input
                                type="text"
                                name="sport"
                                id="sport"
                                value={formData.sport}
                                onChange={handleInputChange}
                                required
                                className={darkInputStyles}
                            />
                        </div>
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
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="instagramHandle" className="block text-sm font-medium text-gray-700">Instagram Handle (Optional)</label>
                        <input
                            type="text"
                            name="instagramHandle"
                            id="instagramHandle"
                            value={formData.instagramHandle || ''}
                            onChange={handleInputChange}
                            placeholder="username (without @)"
                            className={darkInputStyles}
                        />
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Athlete
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AthleteFormModal;