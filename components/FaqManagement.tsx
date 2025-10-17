import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FaqItem } from '../types';
import FaqFormModal from './FaqFormModal';

const FaqManagement: React.FC = () => {
    const { faqs, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [faqToEdit, setFaqToEdit] = useState<FaqItem | null>(null);

    const handleAddNew = () => {
        setFaqToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (faq: FaqItem) => {
        setFaqToEdit(faq);
        setIsModalOpen(true);
    };

    const handleDelete = (faqId: string) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            const newFaqs = faqs.filter(f => f.id !== faqId);
            updateData('faqs', newFaqs);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage FAQs ({faqs.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New FAQ
                    </button>
                </div>
                <div className="divide-y divide-gray-200">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="p-4 flex justify-between items-start">
                           <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                                <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                           </div>
                            <div className="ml-4 flex-shrink-0 space-x-2">
                                <button onClick={() => handleEdit(faq)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                     {faqs.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No FAQs found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <FaqFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    faqToEdit={faqToEdit}
                />
            )}
        </>
    );
};

export default FaqManagement;