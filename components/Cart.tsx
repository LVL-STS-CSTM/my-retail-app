
import React, { useState, useEffect } from 'react';
import { useQuote } from '../context/CartContext';
import { CloseIcon, TrashIcon } from './icons';
import { QuoteItem, SubmittedQuote, SubmittedQuoteItem } from '../types';
import Button from './Button';

/**
 * @interface QuoteModalProps
 * @description Props for the QuoteModal component.
 */
interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    showToast: (message: string) => void;
}

/**
 * @description A slide-in modal for managing the quote request list.
 * It contains sub-components for displaying the form and a success message.
 */
const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, showToast }) => {
    // Access the quote context to get items and the clear function.
    const { quoteItems, clearQuote } = useQuote();
    // State to track if the quote has been successfully submitted.
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Effect to reset the submitted state when the modal is closed.
    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow for the closing animation to finish.
            setTimeout(() => {
                setIsSubmitted(false);
            }, 300);
        }
    }, [isOpen]);

    // Custom close handler that also clears the quote list after a successful submission.
    const handleClose = () => {
        if(isSubmitted){
             clearQuote();
        }
        onClose();
    }

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            ></div>
            {/* Modal Content */}
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">{isSubmitted ? 'Quote Submitted' : 'Your Quote Request'}</h2>
                        <button onClick={handleClose} aria-label="Close quote modal">
                            <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                        </button>
                    </header>

                    {/* Conditionally render the success view or the form view. */}
                    {isSubmitted ? (
                        <SuccessView onClose={handleClose} />
                    ) : (
                        <QuoteFormView 
                            quoteItems={quoteItems}
                            onSuccess={() => setIsSubmitted(true)}
                            showToast={showToast}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

/**
 * @description The main view of the quote modal, containing the item list and contact form.
 */
const QuoteFormView: React.FC<{quoteItems: QuoteItem[], onSuccess: () => void, showToast: (message: string) => void}> = ({ quoteItems, onSuccess, showToast }) => {
    // State for the contact form data.
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '', phone: '' });
    // State to manage the loading state of the submission button.
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const inputClasses = "w-full px-4 py-3 bg-[#3A3A3A] text-white placeholder-gray-400 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white";


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Convert quote items to a serializable format for storage.
        const itemsForSubmission: SubmittedQuoteItem[] = quoteItems.map(item => ({
            product: {
                id: item.product.id,
                name: item.product.name,
                category: item.product.category,
                categoryGroup: item.product.categoryGroup,
            } as any, // Only send necessary product info
            selectedColor: item.selectedColor,
            sizeQuantities: item.sizeQuantities,
            // We are not uploading files in this architecture.
            customizations: item.customizations,
        }));

        const submissionData = {
            contact: formData,
            items: itemsForSubmission,
        };

        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                onSuccess(); // Trigger the success view.
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.message || 'Could not submit quote.'}`);
            }
        } catch (error) {
            showToast('Error: Failed to connect to server.');
            console.error('Quote submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* List of items in the quote */}
            <div className="flex-1 overflow-y-auto p-4">
                {quoteItems.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <p>Your quote list is empty.</p>
                        <p className="text-sm mt-2">Add items from our catalogue to get started.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {quoteItems.map(item => (
                            <QuoteItemRow key={item.quoteItemId} item={item} />
                        ))}
                    </ul>
                )}
            </div>
            
            {/* Contact form, only shown if there are items in the quote */}
            {quoteItems.length > 0 && (
                <footer className="p-4 border-t bg-white overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-md font-semibold mb-4 text-gray-800">Contact Information</h3>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Full Name" required className={inputClasses} value={formData.name} onChange={handleInputChange} />
                            <input type="email" name="email" placeholder="Email Address" required className={inputClasses} value={formData.email} onChange={handleInputChange} />
                            <input type="tel" name="phone" placeholder="Contact Number" required className={inputClasses} value={formData.phone} onChange={handleInputChange} />
                            <input type="text" name="company" placeholder="Company Name (Optional)" className={inputClasses} value={formData.company} onChange={handleInputChange} />
                            <textarea name="message" placeholder="Message (e.g., project details, deadlines)" rows={3} className={inputClasses} value={formData.message} onChange={handleInputChange}></textarea>
                        </div>
                        <Button
                            type="submit"
                            variant="solid"
                            className="w-full mt-4 rounded-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                        </Button>
                    </form>
                </footer>
            )}
        </>
    )
}

/**
 * @description A view displayed after the quote request has been successfully submitted.
 */
const SuccessView: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <svg className="w-16 h-16 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Request Sent!</h3>
        <p className="text-gray-600 mb-6">Thank you for your interest. We've received your quote request and our team will get back to you within 1-2 business days.</p>
        <Button
            type="button"
            variant="solid"
            className="w-full"
            onClick={onClose}
        >
            Close
        </Button>
    </div>
);

/**
 * @description A component to render a single item row in the quote list.
 */
const QuoteItemRow: React.FC<{item: QuoteItem}> = ({ item }) => {
    const { removeFromQuote } = useQuote();
    // FIX: Add explicit types to reduce callback parameters to fix type inference issue.
    const totalQuantity = Object.values(item.sizeQuantities).reduce((sum: number, qty: number) => sum + qty, 0);
    const sizeBreakdown = Object.entries(item.sizeQuantities)
        .map(([size, qty]) => `${size}: ${qty}`)
        .join(', ');

    const imagesForColor = item.product.imageUrls[item.selectedColor.name] || [];
    const fallbackImages = Object.values(item.product.imageUrls).flat();
    const imageUrl = imagesForColor[0] || fallbackImages[0] || 'https://placehold.co/100x120?text=No+Image';

    return (
        <li className="flex py-4 space-x-4">
            <img src={imageUrl} alt={item.product.name} className="w-20 h-24 object-cover rounded-md flex-shrink-0 bg-gray-100" />
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.selectedColor.name}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate" title={sizeBreakdown}>
                        {sizeBreakdown}
                    </p>
                    {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-1">
                            <p className="text-xs font-semibold text-gray-800">Customizations:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside pl-1 max-h-20 overflow-y-auto">
                                {item.customizations.map((cust, index) => (
                                    <li key={index} className="truncate">
                                        {cust.name} {cust.number && `#${cust.number}`} ({cust.size})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {item.logoFile && <p className="text-xs text-gray-500 mt-1 truncate">Logo: {item.logoFile.name}</p>}
                    {item.designFile && <p className="text-xs text-gray-500 mt-1 truncate">Design: {item.designFile.name}</p>}
                </div>
                <div className="flex items-center justify-between mt-2">
                   <p className="text-sm font-semibold">{totalQuantity} Pieces</p>
                     <button onClick={() => removeFromQuote(item.quoteItemId)} className="text-gray-400 hover:text-red-500" aria-label="Remove item">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default QuoteModal;
