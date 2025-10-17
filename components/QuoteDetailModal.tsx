
import React from 'react';
import { SubmittedQuote } from '../types';
import { CloseIcon } from './icons';

interface QuoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: SubmittedQuote;
}

/**
 * @description A modal to display the full details of a submitted quote. Used in the Admin Dashboard.
 */
const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({ isOpen, onClose, quote }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold">Quote Details</h2>
                    <button onClick={onClose} aria-label="Close quote details">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Client Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Client Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><strong>Name:</strong> {quote.contact.name}</div>
                            <div><strong>Email:</strong> <a href={`mailto:${quote.contact.email}`} className="text-blue-600 hover:underline">{quote.contact.email}</a></div>
                            <div><strong>Company:</strong> {quote.contact.company || 'N/A'}</div>
                            <div><strong>Phone:</strong> {quote.contact.phone}</div>
                            <div className="sm:col-span-2"><strong>Submitted:</strong> {new Date(quote.submissionDate).toLocaleString()}</div>
                        </div>
                        {quote.contact.message && (
                            <div className="mt-4">
                                <strong>Message:</strong>
                                <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-md border">{quote.contact.message}</p>
                            </div>
                        )}
                    </section>
                    
                    {/* Requested Items Section */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Requested Items</h3>
                        <div className="space-y-4">
                            {quote.items.map((item, index) => {
                                const imagesForColor = item.product.imageUrls[item.selectedColor.name] || [];
                                const fallbackImages = Object.values(item.product.imageUrls).flat();
                                const imageUrl = imagesForColor[0] || fallbackImages[0] || 'https://placehold.co/100x100?text=No+Image';

                                return (
                                <div key={index} className="flex flex-col sm:flex-row p-3 border rounded-md bg-gray-50 space-y-3 sm:space-y-0 sm:space-x-4">
                                    <img 
                                        src={imageUrl} 
                                        alt={item.product.name} 
                                        className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-100" 
                                    />
                                    <div className="flex-1 text-sm">
                                        <h4 className="font-bold">{item.product.name}</h4>
                                        <p><strong>Color:</strong> {item.selectedColor.name}</p>
                                        <div className="mt-2">
                                            <strong>Size Breakdown:</strong>
                                            <ul className="list-disc list-inside ml-1">
                                                {Object.entries(item.sizeQuantities).map(([size, qty]) => (
                                                    <li key={size}>{size}: {qty} pieces</li>
                                                ))}
                                            </ul>
                                        </div>
                                         <div className="mt-2">
                                            {/* FIX: Add explicit types to reduce callback parameters to fix type inference issue. */}
                                            <strong>Total:</strong> {Object.values(item.sizeQuantities).reduce((sum: number, qty: number) => sum + qty, 0)} pieces
                                        </div>
                                        {item.customizations && item.customizations.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <strong className="block mb-1">Customizations:</strong>
                                                <div className="max-h-40 overflow-y-auto border rounded-md">
                                                    <table className="min-w-full text-xs text-left">
                                                        <thead className="bg-gray-200 sticky top-0">
                                                            <tr>
                                                                <th className="p-2 font-semibold">Name</th>
                                                                <th className="p-2 font-semibold">Number</th>
                                                                <th className="p-2 font-semibold">Size</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-100">
                                                            {item.customizations.map((cust, custIndex) => (
                                                                <tr key={custIndex}>
                                                                    <td className="p-2">{cust.name}</td>
                                                                    <td className="p-2">{cust.number}</td>
                                                                    <td className="p-2">{cust.size}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-2 space-y-1">
                                            {item.logoFilename && <p><strong>Logo File:</strong> {item.logoFilename}</p>}
                                            {item.designFilename && <p><strong>Design File:</strong> {item.designFilename}</p>}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetailModal;
