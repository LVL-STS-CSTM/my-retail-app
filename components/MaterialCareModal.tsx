import React from 'react';
import { CloseIcon } from './icons';

interface MaterialCareModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string;
}

const MaterialCareModal: React.FC<MaterialCareModalProps> = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                    aria-label="Close modal"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>

                <div className="p-6 overflow-y-auto">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Material Care Instructions" className="w-full h-auto object-contain rounded-md" />
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-semibold text-gray-800">Coming Soon!</h3>
                            <p className="text-gray-500 mt-2">Material care instructions for this fabric will be available shortly.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaterialCareModal;
