import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Athlete } from '../types';
import AthleteFormModal from './AthleteFormModal';

const AthleteManagement: React.FC = () => {
    const { athletes, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [athleteToEdit, setAthleteToEdit] = useState<Athlete | null>(null);

    const handleAddNew = () => {
        setAthleteToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (athlete: Athlete) => {
        setAthleteToEdit(athlete);
        setIsModalOpen(true);
    };

    const handleDelete = (athleteId: string, athleteName: string) => {
        if (window.confirm(`Are you sure you want to delete the athlete "${athleteName}"?`)) {
            const newAthletes = athletes.filter(a => a.id !== athleteId);
            updateData('athletes', newAthletes);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Athletes ({athletes.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Athlete
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {athletes.map((athlete) => (
                                <tr key={athlete.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={athlete.imageUrl} alt={athlete.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{athlete.sport}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">@{athlete.instagramHandle || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(athlete)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(athlete.id, athlete.name)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {athletes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No athletes found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <AthleteFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    athleteToEdit={athleteToEdit}
                />
            )}
        </>
    );
};

export default AthleteManagement;