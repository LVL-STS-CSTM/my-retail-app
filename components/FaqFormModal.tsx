import React, { useState, useEffect } from 'react';
import { FaqItem } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface FaqFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    faqToEdit: FaqItem | null;
}

const emptyFaq: Omit<FaqItem, 'id'> = {
    question: '',
    answer: '',
};

const FaqFormModal: React.FC<FaqFormModalProps> = ({ isOpen, onClose, faqToEdit }) => {
    const { faqs, updateData } = useData();
    const [formData, setFormData] = useState<FaqItem | Omit<FaqItem, 'id'>>(faqToEdit || emptyFaq);
    
    useEffect(() => {
        setFormData(faqToEdit || emptyFaq);
    }, [faqToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) {
            alert('Please fill out all fields.');
            return;
        }

        if (faqToEdit && 'id' in formData) {
            const updatedFaqs = faqs.map(f => f.id === (formData as FaqItem).id ? formData as FaqItem : f);
            updateData('faqs', updatedFaqs);
        } else {
            const newFaq = { ...formData, id: `faq-${Date.now()}` };
            updateData('faqs', [...faqs, newFaq]);
        }
        onClose();
    };
    
    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{faqToEdit ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                     <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
                        <input
                            type="text"
                            name="question"
                            id="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                        <textarea
                            name="answer"
                            id="answer"
                            rows={6}
                            value={formData.answer}
                            onChange={handleInputChange}
                            required
                            className={darkInputStyles}
                        />
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save FAQ
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default FaqFormModal;