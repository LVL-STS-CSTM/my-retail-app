import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { HeroContent } from '../types';
import HeroFormModal from './HeroFormModal';
import { DragHandleIcon } from './icons';

const HeroManagement: React.FC = () => {
    const { heroContents, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [heroToEdit, setHeroToEdit] = useState<HeroContent | null>(null);
    const [localHeroOrder, setLocalHeroOrder] = useState<HeroContent[]>([]);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        setLocalHeroOrder([...heroContents].sort((a, b) => a.displayOrder - b.displayOrder));
        setHasOrderChanges(false);
    }, [heroContents]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleAddNew = () => {
        setHeroToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (hero: HeroContent) => {
        setHeroToEdit(hero);
        setIsModalOpen(true);
    };

    const handleDelete = (heroId: string, heroTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the hero banner "${heroTitle}"?`)) {
            const newHeroes = heroContents.filter(h => h.id !== heroId);
            updateData('heroContents', newHeroes);
            showToast('Banner deleted successfully!');
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        dragItem.current = index;
        e.currentTarget.classList.add('bg-gray-100', 'shadow-lg');
    };

    const handleDragEnter = (_e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove('bg-gray-100', 'shadow-lg');
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            const newHeroes = [...localHeroOrder];
            const draggedItemContent = newHeroes.splice(dragItem.current, 1)[0];
            newHeroes.splice(dragOverItem.current, 0, draggedItemContent);
            setLocalHeroOrder(newHeroes);
            setHasOrderChanges(true);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleSaveOrder = () => {
        const reordered = localHeroOrder.map((h, index) => ({ ...h, displayOrder: index }));
        updateData('heroContents', reordered);
        setHasOrderChanges(false);
        showToast('Banner order saved!');
    };

    const handleCancelOrderChanges = () => {
        setLocalHeroOrder([...heroContents].sort((a, b) => a.displayOrder - b.displayOrder));
        setHasOrderChanges(false);
    };

    return (
        <div className="relative">
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toastMessage}
                </div>
            )}
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-semibold">Manage Hero Banners ({heroContents.length})</h2>
                    <div className="flex items-center gap-4">
                        {hasOrderChanges && (
                            <>
                                <button
                                    onClick={handleCancelOrderChanges}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveOrder}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Save Order
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                        >
                            Add New Banner
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 w-10 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Button Text</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links To Collection</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {localHeroOrder.map((hero, index) => (
                                <tr
                                    key={hero.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="cursor-grab transition-shadow"
                                >
                                    <td className="px-3 py-4 whitespace-nowrap text-gray-400 text-center">
                                        <DragHandleIcon className="w-5 h-5 inline-block"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hero.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.buttonText || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.buttonCollectionLink || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(hero)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(hero.id, hero.title)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {localHeroOrder.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No hero banners found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <HeroFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    heroToEdit={heroToEdit}
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default HeroManagement;