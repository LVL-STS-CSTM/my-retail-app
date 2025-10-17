import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { InfoCard, View } from '../types';

const allViews: View[] = [
    'about', 'partners', 'contact', 'faq', 'services', 
    'terms-of-service', 'return-policy', 'privacy-policy', 'materials', 'catalogue', 'mockup-generator'
];

const InfoCardEditor: React.FC<{ cardData: InfoCard; showToast: (message: string) => void; }> = ({ cardData, showToast }) => {
    const { infoCards, updateData } = useData();
    const [formData, setFormData] = useState<InfoCard>(cardData);

    useEffect(() => {
        setFormData(cardData);
    }, [cardData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newForm = { ...prev, [name]: value };
            // If we change the link type, reset the link value to prevent invalid combinations
            if (name === 'linkType') {
                newForm.linkValue = '';
            }
            return newForm;
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCards = infoCards.map(c => c.id === formData.id ? formData : c);
        updateData('infoCards', updatedCards);
        showToast(`'${formData.title.replace('\n', ' ')}' card saved!`);
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500";
    
    return (
        <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`title-${formData.id}`} className="block text-sm font-medium text-gray-700">Title</label>
                        <textarea
                            name="title"
                            id={`title-${formData.id}`}
                            rows={2}
                            value={formData.title}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        />
                         <p className="text-xs text-gray-500 mt-1">Use a new line for a line break.</p>
                    </div>
                    <div>
                        <label htmlFor={`imageUrl-${formData.id}`} className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id={`imageUrl-${formData.id}`}
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`linkType-${formData.id}`} className="block text-sm font-medium text-gray-700">Link Type</label>
                        <select
                            name="linkType"
                            id={`linkType-${formData.id}`}
                            value={formData.linkType}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        >
                            <option value="page">Internal Page</option>
                            <option value="modal">Modal Pop-up</option>
                            <option value="external">External URL</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`linkValue-${formData.id}`} className="block text-sm font-medium text-gray-700">Link Destination</label>
                        {formData.linkType === 'page' && (
                            <select name="linkValue" id={`linkValue-${formData.id}`} value={formData.linkValue} onChange={handleInputChange} className={darkInputStyles}>
                                 <option value="">-- Select Page --</option>
                                 {allViews.sort().map(view => <option key={view} value={view}>{view.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                            </select>
                        )}
                        {formData.linkType === 'modal' && (
                            <select name="linkValue" id={`linkValue-${formData.id}`} value={formData.linkValue} onChange={handleInputChange} className={darkInputStyles}>
                                <option value="">-- Select Modal --</option>
                                <option value="subscribe">Subscription Modal</option>
                                <option value="search">Search Modal</option>
                            </select>
                        )}
                        {formData.linkType === 'external' && (
                            <input
                                type="url"
                                name="linkValue"
                                id={`linkValue-${formData.id}`}
                                value={formData.linkValue}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                className={darkInputStyles}
                                required
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm font-semibold">
                        Save Card
                    </button>
                </div>
            </form>
        </div>
    );
};

const InfoCardManagement: React.FC = () => {
    const { infoCards } = useData();
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    return (
        <div className="space-y-6 relative">
             {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}
            {infoCards
                .sort((a, b) => {
                    const order = ['pursuit', 'newsletter', 'fabric'];
                    return order.indexOf(a.id) - order.indexOf(b.id);
                })
                .map(card => (
                    <InfoCardEditor key={card.id} cardData={card} showToast={showToast} />
                ))
            }
        </div>
    );
}

export default InfoCardManagement;