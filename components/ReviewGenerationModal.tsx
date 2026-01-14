
import React, { useState } from 'react';
import { CloseIcon, SparklesIcon } from './icons';
import { generateBrandReview } from '../services/geminiService';

interface ReviewGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReviewGenerated: (review: { author: string; quote: string }) => void;
}

const ReviewGenerationModal: React.FC<ReviewGenerationModalProps> = ({ isOpen, onClose, onReviewGenerated }) => {
    const [keywords, setKeywords] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keywords.trim()) {
            setError('Please enter some keywords.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const result = await generateBrandReview(keywords);
            if (result && result.quote && result.author) {
                onReviewGenerated(result);
            } else {
                throw new Error('Received an empty or invalid response from the AI.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate review. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true">
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Generate Review with AI</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleGenerate} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords or Theme</label>
                        <input
                            type="text"
                            id="keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            required
                            autoFocus
                            placeholder="e.g., great quality jerseys, fast delivery"
                            className={darkInputStyles}
                        />
                        <p className="text-xs text-gray-500 mt-1">Provide a few key points for the AI to build upon.</p>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <footer className="pt-2 flex justify-end items-center space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ReviewGenerationModal;
